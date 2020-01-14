var { User, userTypes } = require('../user/user.model.js');
const GroupMember = require('../groupMember/groupMember.model');
var Mission = require('../mission/mission.model.js');
var MissionAnswer = require('./missionAnswer.model.js');
var Uploads = require('../../upload.js');
const mongoose = require('mongoose');
const config = require('config');

exports.listMissionAnswers = async (req, res) => {
  const query = {
    ...req.query,
    _mission: req.params.missionId
  };

  if (req.query.type === userTypes.STUDENT) {
    query._user = req.user.id;
  }

  const missionAnswers = await MissionAnswer.find(query)
    .populate({ path: '_user', select: 'name' })
    .populate({ path: '_mission', select: 'name' });
  res.send(missionAnswers);
};

exports.getMissionAnswer = async (req, res) => {
  res.send(await req.missionAnswer
    .populate({ path: '_user', select: 'name' })
    .populate({ path: '_mission', select: 'name' })
    .execPopulate()
  );
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
    filename = req.user.id + timeStamp + '.jpg';

    Uploads.uploadFile(req.body.image, req.user.id, timeStamp);
    missionAnswer.image = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  };
  if (req.body.audio) {
    Uploads.uploadAudio(req.body.audio, req.user.id, timeStamp);

    filename = req.user.id + timeStamp + '.wav';
    missionAnswer.audio = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  };
  if (req.body.video) {
    Uploads.uploadVideo(req.body.video, req.user.id, timeStamp);

    filename = req.user.id + timeStamp + '.mp4';
    missionAnswer.video = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  };

  const id = mongoose.Types.ObjectId(req.user.id);
  const mission = await Mission.findById(req.params.missionId);
  mission.users.push(id);
  await mission.save();
  await missionAnswer.save();
  res.status(201).send(missionAnswer);
};

exports.updateMissionAnswer = (req, res) => {
  MissionAnswer.findById(req.params.missionAnswerId, function (err, missionAnswer) {
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
      missionAnswer.image = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
    };
    if (req.body.audio) {
      Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

      filename = req.body._user.toString() + timeStamp + '.wav';
      missionAnswer.audio = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
    };
    if (req.body.video) {
      Uploads.uploadVideo(req.body.video, req.body._user.toString(), timeStamp);

      filename = req.body._user.toString() + timeStamp + '.mp4';
      missionAnswer.video = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
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

exports.deleteMissionAnswer = async (req, res) => {
  const missionAnswer = await MissionAnswer.findByIdAndDelete(req.params.missionAnswerId);
  res.send(missionAnswer);
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
