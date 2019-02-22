var express = require('express');
var router = express.Router();

const groupMemberCtrl = require('./group.controller');

router.get('/', groupMemberCtrl.listGroupMembers);

router.get('/query/fields', groupMemberCtrl.findGroupMemberById);

router.get('/groups', groupMemberCtrl.findGroupsFromUser);

router.post('/', groupMemberCtrl.createGroupMember);

router.post('/update/:member_id', groupMemberCtrl.updateGroupMember);

router.put('/:member_id', groupMemberCtrl.updateGroupMember);

router.post('/remove/:member_id', groupMemberCtrl.deleteGroupMember);

router.delete('/:member_id', groupMemberCtrl.deleteGroupMember);

module.exports = router;
