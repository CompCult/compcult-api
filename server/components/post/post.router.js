var express = require('express');
var router = express.Router();

const postCtrl = require('./post.controller');

router.get('/', postCtrl.listPosts);

router.get('/query/fields', postCtrl.findPostByParams);

router.post('/', postCtrl.createPost);

router.post('/update/:post_id', postCtrl.updatePost);

router.post('/remove/:post_id', postCtrl.deletePost);

module.exports = router;
