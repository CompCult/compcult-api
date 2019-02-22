var express = require('express');
var router = express.Router();

const groupCtrl = require('./group.controller');

router.get('/', groupCtrl.listGroups);

router.get('/query/fields', groupCtrl.findGroupByParams);

router.post('/email', groupCtrl.sendEmailToGroup);

router.post('/', groupCtrl.createGroup);

router.post('/update/:group_id', groupCtrl.updateGroup);

router.put('/:group_id', groupCtrl.updateGroup);

router.post('/remove/:group_id', groupCtrl.deleteGroup);

router.delete('/:group_id', groupCtrl.deleteGroup);

module.exports = router;
