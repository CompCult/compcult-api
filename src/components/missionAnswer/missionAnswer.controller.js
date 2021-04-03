var { User, userTypes } = require('../user/user.model.js');
const GroupMember = require('../groupMember/groupMember.model');
var Mission = require('../mission/mission.model.js');
var MissionAnswer = require('./missionAnswer.model.js');
var StoreItem = require('../storeItem/storeItem.model');
var Uploads = require('../../upload.js');
const mongoose = require('mongoose');
const config = require('config');
const _ = require('lodash');


exports.georeferencedanswers = async (req, res) => {
  const query = {
    location_lat: { $exists: true, $ne: null },
    location_lng: { $exists: true, $ne: null },
  };

  const missionAnswers = await MissionAnswer.find(query)
    .populate({ path: '_user', select: ['_id', 'name', 'email'] })
    .populate({ path: '_mission', select: ['_id', 'name', 'description', '_user', 'lux', 'resources', 'secret_code'] });
  res.send(missionAnswers.filter(missionAnswer => missionAnswer._mission != null && missionAnswer._user != null));
};

exports.listMissionAnswers = async (req, res) => {
  let query = {
    ...req.query,
    _mission: req.params.missionId
  };
  query = _.pickBy(query, _.identity);

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

  const mission = await Mission.findById(req.params.missionId);
  if (!mission) res.status(404).send('Mission not found');

  const missionAnswer = new MissionAnswer({
    ...req.body,
    _user: req.user.id,
    _mission: req.params.missionId,
  });

  if (mission.isEntrepreneurial) {
    if (!req.body.title || !req.body.value) return res.status(404).send('required fields: value and title');
    missionAnswer.value = req.body.value;
    missionAnswer.title = req.body.title;
  }

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

          missionAnswer.imp = req.body.imp || 0;
          missionAnswer.people = req.body.people || 0;

          if (mission.isEntrepreneurial) {
            var item = new StoreItem({
              _user: missionAnswer._user,
              title: missionAnswer.title,
              value: missionAnswer.value,
              isCreatedByMission: true,
              missionId: mission.id,
              image: missionAnswer.image,
              video: missionAnswer.video,
              text: missionAnswer.text_msg,
              audio: missionAnswer.audio,
              has_image: mission.has_image,
              has_video: mission.has_video,
              has_audio: mission.has_audio,
              has_text: mission.has_text
            });

            await item.save();

          }

          if (mission.is_grupal) {
            const members = await GroupMember.find({ _group: missionAnswer._group });
            members.map(member => {
              recompenseUser(member._user, mission.lux, mission.resources, missionAnswer.imp, missionAnswer.people);
            });
          } else {
            recompenseUser(missionAnswer._user, mission.lux, mission.resources, missionAnswer.imp, missionAnswer.people);
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


function recompenseUser(userId, lux, resources, impact, people) {
  User.findById(userId, function (err, user) {
    if (err) throw err;

    if (user) {
      user.lux += lux;
      user.resources += resources;
      user.imp += impact;
      user.people += people;
      user.save(function (err) {
        if (err) throw err;

        console.log('Usuário recompensado');
      });
    }
  });
};

