const Mission = require('./mission.model');
const MissionAnswer = require('../missionAnswer/missionAnswer.model.js');
const mongoose = require('mongoose');
const _ = require('lodash');

exports.listMissions = async (req, res) => {

  if (Object.keys(req.query).includes('secret_code')){
    return exports.findPrivateMission(req, res);
  }

  let query = _.omit(req.query, ['answered', 'is_public']);

  if (Object.keys(req.query).includes('is_public')){
    const userId = mongoose.Types.ObjectId(req.user.id);
    query.$or = [
      {is_public: true},
      {visible_to: userId}
    ];
  }

  if (Object.keys(req.query).includes('answered')) {
    if ((!Number(req.query.answered))) {
      const userId = mongoose.Types.ObjectId(req.user.id);
      query.users = { '$not': { '$all': [userId] } };
    }
  }

  const missions = await Mission.find(query);
  res.send(missions);
};

exports.getMission = async (req, res) => {
  const mission = await Mission.findById(req.params.missionId);
  res.send(mission);
};

exports.findMissionByParams = (req, res) => {
  Mission.find(req.query, function (err, mission) {
    if (err) {
      res.status(400).send(err);
    } else if (!mission) {
      res.status(404).send('Missão não encontrada');
    } else {
      res.status(200).json(mission);
    }
  });
};

exports.findPublicMissions = (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id);
  var query = {
    '$or': [
      {is_public: true},
      {visible_to: {'$all': [userId]}}
    ]
  }
  Mission.find(query, async function (err, missions) {
    if (err) {
      res.status(400).send(err);
    } else {
      var result = [];
      let date = new Date();

      for (var i = 0; i < missions.length; i++) {
        let mission = missions[i];
        console.log(mission);
        let endTime = new Date(mission.end_time);
        endTime.setHours(23, 59, 0);
        let inTime = endTime >= date;

        if (mission.single_answer) {
          console.log('single answer');
          await wasMissionAnswered(mission._id, req.query.user_id).then((answered) => {
            if (!answered && inTime) {
              console.log('single answer not answered and in time');
              result.push(mission);
            }
          });
        } else if (!mission.single_answer && inTime) {
          console.log('not single answer and in time');
          result.push(mission);
        }
      }
    }

    res.status(200).send(result);
  });
};

exports.findPrivateMission = (req, res) => {
  Mission.findOne({ secret_code: req.query.secret_code }, async function (err, mission) {
    if (err) {
      res.status(400).send(err);
    } else if (!mission) {
      res.status(404).send('Missão não encontrada');
    } else {
        
      const id = mongoose.Types.ObjectId(req.user.id);
      mission.visible_to.push(id);
      await mission.save();

      res.status(200).json(mission);
      
    }
  });
};

exports.createMission = async (req, res) => {
  var mission = new Mission(req.body);
  mission._user = req.user.id;
  mission.secret_code = generateSecretCode();

  await mission.save();
  res.send(mission);
};

exports.updateMission = async (req, res) => {
  req.mission.set(req.body);

  if (req.body.start_time) {
    const startTime = new Date(req.body.start_time);
    startTime.setHours(23, 59, 0);
    req.mission.start_time = startTime;
  }
  if (req.body.end_time) {
    const endTime = new Date(req.body.end_time);
    endTime.setHours(23, 59, 0);
    req.mission.end_time = endTime;
  }

  await req.mission.save();
  res.send(req.mission);
};

exports.deleteMission = async (req, res) => {
  await req.mission.delete();
  res.send(req.mission);
};

async function wasMissionAnswered (mission, user) {
  const answers = await MissionAnswer.find({ _mission: mission, _user: user }).exec();
  return answers.length > 0;
}

function generateSecretCode () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};
