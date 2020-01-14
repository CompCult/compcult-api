const Memory = require('./memory.model');
const Uploads = require('../../../upload.js');
const config = require('config');
const _ = require('lodash');

exports.listMemories = async (req, res) => {
  let query = _.omit(req.query, ['answered']);

  // if (Object.keys(req.query).includes('answered')) {
  //   if (!Number(req.query.answered)) {
  //     const userId = mongoose.Types.ObjectId(req.user.id);
  //     query.users = { '$not': { '$all': [userId] } };
  //   }
  // }

  const memories = await Memory.find(query);
  res.send(memories);
};

exports.getQuiz = (req, res) => {
  res.send(req.quiz);
};

exports.createMemory = async (req, res) => {
  const memory = new Memory(_.omit(req.body, 'images'));
  memory._user = req.user.id;

  if (req.body.images) {
    const timestamp = Date.now();

    await Promise.all(req.body.images.map((image) => {
      const filename = req.user.id + timestamp + '.jpg';

      memory.images.push('https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename);
      return Uploads.uploadFile(image, req.user.id, timestamp);
    }));
  };

  await memory.save();
  res.send(memory);
};

exports.deleteMemory = async (req, res) => {
  await req.memory.delete();
  res.send(req.memory);
};
