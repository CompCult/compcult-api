var User = require('../user/user.model.js');
var Group = require('./group.model.js');
var Mailer = require('../../mailer.js');
var GroupMember = require('../groupMember/groupMember.model.js');

const api = module.exports;

api.listGroups = (req, res) => {
  Group.find({}, function (err, groups) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(groups);
    }
  });
};

api.findGroupByParams = (req, res) => {
  Group.find(req.query, function (err, Group) {
    if (err) {
      res.status(400).send(err);
    } else if (!Group) {
      res.status(404).send('Grupo não encontrado');
    } else {
      res.status(200).json(Group);
    }
  });
};

api.sendEmailToGroup = async (req, res) => {
  let groupId = req.body._group;
  let author = req.body.author;
  let message = req.body.message;

  try {
    const members = await GroupMember.find({ _group: groupId }).exec();
    const promises = members.map(getMemberEmail);

    Promise.all(promises).then(function (results) {
      Mailer.sendMail(results, 'Grupos - Mensagem de ' + author, message);

      res.status(200).json('Enviando mensagens...');
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

api.createGroup = (req, res) => {
  var group = new Group();
  group.name = req.body.name;
  group.description = req.body.description;

  group.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(group);
    }
  });
};

api.updateGroup = (req, res) => {
  Group.findById(req.params.group_id, function (err, group) {
    if (err) throw err;

    if (req.body.name) group.name = req.body.name;
    if (req.body.description) group.description = req.body.description;

    group.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(group);
      }
    });
  });
};

api.deleteGroup = (req, res) => {
  Group.remove({ _id: req.params.group_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeGroupMembers(req.params.group_id);

      res.status(200).send('Grupo removido.');
    }
  });
};

async function getMemberEmail (member) {
  let userObj = await User.findById(member._user).exec();
  return userObj.email;
}

function removeGroupMembers (groupId) {
  GroupMember.deleteMany({ _group: groupId }).exec();
}
