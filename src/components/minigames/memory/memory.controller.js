const Memory = require('./memory.model');
const Uploads = require('../../../upload.js');
const config = require('config');
const utils = require('../../../utils');
const _ = require('lodash');

function findPrivateMemoryGame(req, res) {
  Memory.findOne({ secret_code: req.query.secret_code }, async function (err, game) {
    if (err) {
      res.status(400).send(err);
    } else if (!game) {
      res.status(404).send('Jogo não encontrado');
    } else {
        
      const id = mongoose.Types.ObjectId(req.user.id);
      game.visible_to.push(id);
      await game.save();

      res.status(200).json([game]); 
    }
  });
};

exports.listMemories = async (req, res) => {

  if (Object.keys(req.query).includes('secret_code')){
    return findPrivateMemoryGame(req, res);
  }

  let query = _.omit(req.query, ['answered', 'is_public']);

  if (Object.keys(req.query).includes('is_public')){
    const userId = mongoose.Types.ObjectId(req.user.id);
    query.$or = [
      {is_public: true},
      {visible_to: userId}
    ];
  }

  // if (Object.keys(req.query).includes('answered')) {
  //   if (!Number(req.query.answered)) {
  //     const userId = mongoose.Types.ObjectId(req.user.id);
  //     query.users = { '$not': { '$all': [userId] } };
  //   }
  // }

  const memories = await Memory.find(query);
  res.send(memories);
};

exports.getMemory = (req, res) => {
  res.send(req.memory);
};

exports.createMemory = async (req, res) => {
  const memory = new Memory(_.omit(req.body, 'images'));
  memory._user = req.user.id;

  if (req.body.images) {
    const timestamp = Date.now();

    await Promise.all(req.body.images.map((image) => {
      const stamp = utils.randomBytes(5) + timestamp;
      const filename = req.user.id + stamp + '.jpg';

      memory.images.push('https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename);
      return Uploads.uploadFile(image, req.user.id, stamp);
    }));
  };

  await memory.save();
  res.send(memory);
};

exports.deleteMemory = async (req, res) => {
  await req.memory.delete();
  res.send(req.memory);
};
