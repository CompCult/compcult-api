var User = require('../user/user.model.js');
var Group = require('../group/group.model');
var Mission = require('../mission/mission.model.js');
var MissionAnswer = require('./missionAnswer.model.js');
var Uploads = require('../../upload.js');

const api = module.exports;

api.listMissionAnswers = (req, res) => {
  MissionAnswer.find({}, function (err, missions) {
    if (err) {
      res.status(400).send(err);
    } else {
      let promises;

      try {
        promises = missions.map(injectMissionData);
      } catch (err) {
        res.status(400).send(err);
      }

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    }
  });
};

api.getMissionAnswer = (req, res) => {
  MissionAnswer.find({ _id: req.params.answer_id }, async function (err, answer) {
    if (err) {
      res.status(400).send(err);
    } else if (!answer) {
      res.status(404).send('Resposta não encontrada');
    } else {
      let answerComplete = await injectMissionData(answer);

      res.status(200).send(answerComplete);
    }
  });
};

api.findMissionAnswerByParams = (req, res) => {
  MissionAnswer.find(req.query, function (err, answer) {
    if (err) {
      res.status(400).send(err);
    } else if (!answer) {
      res.status(404).send('Resposta da missão não encontrada');
    } else {
      res.status(200).json(answer);
    }
  });
};

api.createMissionAnswer = (req, res) => {
  var missionAnswer = new MissionAnswer();
  missionAnswer._user = req.body._user;
  missionAnswer._mission = req.body._mission;
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

  missionAnswer.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(missionAnswer);
    }
  });
};

api.updateMissionAnswer = (req, res) => {
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
        Mission.findById(missionAnswer._mission, function (err, mission) {
          if (err) throw err;

          if (mission) {
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

api.deleteMissionAnswer = (req, res) => {
  MissionAnswer.remove({ _id: req.params.mission_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Missão removida.');
    }
  });
};

api.findMissionFromMissionAnswer = (req, res) => {
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