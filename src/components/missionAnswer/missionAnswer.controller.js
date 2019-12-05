var { User, userTypes } = require('../user/user.model.js');
var Group = require('../group/group.model');
const GroupMember = require('../groupMember/groupMember.model');
var Mission = require('../mission/mission.model.js');
var MissionAnswer = require('./missionAnswer.model.js');
var Uploads = require('../../upload.js');
const mongoose = require('mongoose');

exports.listMissionAnswers = async (req, res) => {
  const query = {
    ...req.query,
    _mission: req.params.quizId
  };

  if (req.query.type === userTypes.STUDENT){
    query._user = req.user.id;
  }

  const missionAnswers = await MissionAnswer.find(query);
  res.send(missionAnswers);
};

exports.getMissionAnswer = async(req, res) => {
  res.send(req.missionAnswer);
};

exports.createMissionAnswer = async (req, res) => {
  const missionAnswer = new MissionAnswer({
    ...req.body,
    _user: req.user.id,
    _mission: req.params.missionId,
  });

  missionAnswer.status = 'Pendente';
  const date = new Date();
  const timeStamp = date.toLocaleString();
  let filename;
  if (req.body._group) missionAnswer._group = req.body._group;
  if (req.body.text_msg) missionAnswer.text_msg = req.body.text_msg;
  if (req.body.location_lat) missionAnswer.location_lat = req.body.location_lat;
  if (req.body.location_lng) missionAnswer.location_lng = req.body.location_lng;
  if (req.body.image) {
    filename = req.body._user.toString() + timeStamp + '.jpg';

    Uploads.uploadFile(req.body.image, req.body._user.toString(), timeStamp);
    missionAnswer.image = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
  };
  if (req.body.audio) {
    Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

    filename = req.body._user.toString() + timeStamp + '.wav';
    missionAnswer.audio = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
  };
  if (req.body.video) {
    Uploads.uploadVideo(req.body.video, req.body._user.toString(), timeStamp);

    filename = req.body._user.toString() + timeStamp + '.mp4';
    missionAnswer.video = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
  };

  const id = mongoose.Types.ObjectId(req.user.id);
  const mission = await Mission.findById(req.body.missionId);
  mission.users.push(id);
  await mission.save();
  await missionAnswer.save();
  res.status(201).send(missionAnswer);
};

exports.updateMissionAnswer = (req, res) => {
  MissionAnswer.findById(req.params.mission_id, function (err, missionAnswer) {
    if (err) throw err;

    const date = new Date();
    const timeStamp = date.toLocaleString();
    let filename;
    if (req.body._user) missionAnswer._user = req.body._user;
    if (req.body._mission) missionAnswer._mission = req.body._mission;
    if (req.body._group) missionAnswer._group = req.body._group;
    if (req.body.image) {
      Uploads.uploadFile(req.body.image, req.body._user.toString(), timeStamp);

      filename = req.body._user.toString() + timeStamp + '.jpg';
      missionAnswer.image = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
    };
    if (req.body.audio) {
      Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

      filename = req.body._user.toString() + timeStamp + '.wav';
      missionAnswer.audio = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
    };
    if (req.body.video) {
      Uploads.uploadVideo(req.body.video, req.body._user.toString(), timeStamp);

      filename = req.body._user.toString() + timeStamp + '.mp4';
      missionAnswer.video = 'https://s3.amazonaws.com/compcult/' + process.env.S3_FOLDER + filename;
    };
    if (req.body.text_msg) missionAnswer.text_msg = req.body.text_msg;
    if (req.body.location_lat) missionAnswer.location_lat = req.body.location_lat;
    if (req.body.location_lng) missionAnswer.location_lng = req.body.location_lng;
    if (req.body.status) {
      missionAnswer.status = req.body.status;
      if (req.body.status === 'Aprovado') {
        Mission.findById(missionAnswer._mission, async function (err, mission) {
          if (err) throw err;
          
          if (mission.is_grupal) {
            const members = await GroupMember.find({ _group: missionAnswer._group });
            members.map(member => {
              recompenseUser(member._user, mission.points);
            });
          } else {
            recompenseUser(missionAnswer._user, mission.points);
          }
        });
      }
    }

    missionAnswer.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(missionAnswer);
      }
    });
  });
};

exports.deleteMissionAnswer = (req, res) => {
  req.missionAnswer.delete();
  res.send(req.missionAnswer);
};

exports.findMissionFromMissionAnswer = (req, res) => {
  var missionName = req.query.missionname;
  MissionAnswer.find({ mail: missionName }, function (err, mission) {
    if (err != null) {
      console.log(err);
    }
    res.json(mission);
  });
};

async function injectMissionData (answer) {
  let string = JSON.stringify(answer);
  let answerComplete = JSON.parse(string);

  let userobj = await User.findById(answer._user).exec();
  let missionObj = await Mission.findById(answer._mission).exec();
  let groupObj = await Group.findById(answer._group).exec();

  answerComplete._user = userobj;
  answerComplete._group = groupObj;
  answerComplete._mission = missionObj;

  return answerComplete;
};

function recompenseUser (userId, points) {
  User.findById(userId, function (err, user) {
    if (err) throw err;

    if (user) {
      user.points += points;
      user.save(function (err) {
        if (err) throw err;

        console.log('Usuário recompensado');
      });
    }
  });
};
