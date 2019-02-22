var express = require('express');
var router = express.Router();

const reactionController = require('./reaction.controller');

router.get('/', reactionController.listReactions);

router.get('/query/fields', reactionController.findReactionByParams);

router.post('/', reactionController.addLike);

router.delete('/:reaction_id', reactionController.deleteReaction);

module.exports = router;
