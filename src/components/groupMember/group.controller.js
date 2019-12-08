var { User } = require('../user/user.model');
var Group = require('../group/group.model');
var GroupMember = require('./groupMember.model');

const api = module.exports;

api.listGroupMembers = (req, res) => {
  GroupMember.find({}, function (err, members) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(members);
    }
  });
};

api.findGroupMemberById = async (req, res) => {
  const members = await GroupMember
    .find(req.query)
    .populate({ path: '_user', select: 'name' });
  res.send(members);
};

api.findGroupsFromUser = (req, res) => {
  GroupMember.find({ _user: req.query._user }, function (err, members) {
    if (err) {
      res.status(400).send(err);
    } else if (!members) {
      res.status(404).send('Membro não encontrado');
    } else {
      const promises = members.map(getGroupFromMember);

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    }
  });
};

api.createGroupMember = (req, res) => {
  var member = new GroupMember();

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(404).send('Usuário não encontrado');
    } else {
      member._user = user._id;
      member._group = req.body._group;
      member.is_admin = req.body.is_admin;

      member.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(member);
        }
      });
    }
  });
};

api.updateGroupMember = (req, res) => {
  GroupMember.findById(req.params.member_id, function (err, member) {
    if (err) throw err;

    if (req.body.is_admin !== undefined) member.is_admin = req.body.is_admin;

    member.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(member);
      }
    });
  });
};

api.deleteGroupMember = (req, res) => {
  GroupMember.remove({ _id: req.params.member_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Membro deletado!');
    }
  });
};

async function getGroupFromMember(member) {
  return Group.findById(member._group).exec();
}
