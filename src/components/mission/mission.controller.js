const Mission = require('./mission.model');
const MissionAnswer = require('../missionAnswer/missionAnswer.model.js');

exports.listMissions = (req, res) => {
  Mission.find({}, function (err, missions) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(missions);
    }
  });
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
  Mission.find({ is_public: true }, async function (err, missions) {
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
      let endTime = new Date(mission.end_time);
      endTime.setHours(23, 59, 0);
      let date = new Date();
      let answered;

      try {
        answered = await wasMissionAnswered(mission._id, req.query.user_id);
      } catch (err) {
        res.status(400).send(err);
      }

      if (endTime.toLocaleString() < date.toLocaleString()) {
        res.status(401).send('Missão expirada');
      } else if (mission.single_answer && answered) {
        res.status(401).send('Missão já foi respondida');
      } else {
        res.status(200).json(mission);
      }
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

exports.updateMission = (req, res) => {
  Mission.findById(req.params.mission_id, function (err, mission) {
    if (err) throw err;

    if (req.body.name) mission.name = req.body.name;
    if (req.body.description) mission.description = req.body.description;
    if (req.body.points) mission.points = req.body.points;
    if (req.body.is_public !== undefined) mission.is_public = req.body.is_public;
    if (req.body.is_grupal !== undefined) mission.is_grupal = req.body.is_grupal;
    if (req.body.single_answer !== undefined) mission.single_answer = req.body.single_answer;
    if (req.body.has_image !== undefined) mission.has_image = req.body.has_image;
    if (req.body.has_audio !== undefined) mission.has_audio = req.body.has_audio;
    if (req.body.has_video !== undefined) mission.has_video = req.body.has_video;
    if (req.body.has_text !== undefined) mission.has_text = req.body.has_text;
    if (req.body.has_geolocation !== undefined) mission.has_geolocation = req.body.has_geolocation;
    if (req.body.end_message) mission.end_message = req.body.end_message;
    if (req.body.start_time) {
      const startTime = new Date(req.body.start_time);
      startTime.setHours(23, 59, 0);
      mission.start_time = startTime;
    }
    if (req.body.end_time) {
      const endTime = new Date(req.body.end_time);
      endTime.setHours(23, 59, 0);
      mission.end_time = endTime;
    }

    mission.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(mission);
      }
    });
  });
};

exports.deleteMission = (req, res) => {
  Mission.remove({ _id: req.params.mission_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Missão removida.');
    }
  });
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
