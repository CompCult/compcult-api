var Post = require('./post.model');
var User = require('../user/user.model');
var Uploads = require('../../upload.js');
const config = require('config');

const api = module.exports;

api.listPosts = function (req, res) {
  Post.find({}).sort({ created_at: -1 })
    .catch((err) => {
      res.status(400).send(err);
    })
    .then((posts) => {
      let promises;

      try {
        promises = posts.map(getAuthorInfo);
      } catch (err) {
        res.status(400).send(err);
      }

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    });
};

api.findPostByParams = function (req, res) {
  Post.find(req.query, function (err, posts) {
    if (err) {
      res.status(400).send(err);
    } else if (!posts) {
      res.status(404).send('Post não encontrado');
    } else {
      try {
        const promises = posts.map(getAuthorInfo);

        Promise.all(promises).then(function (results) {
          res.status(200).json(results);
        });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  });
};

api.createPost = function (req, res) {
  var post = new Post();
  post._user = req.body._user;
  var date = new Date();
  var timeStamp = date.toLocaleString();
  let filename;
  if (req.body.text_msg) post.text_msg = req.body.text_msg;
  if (req.body.location_lat) post.location_lat = req.body.location_lat;
  if (req.body.location_lng) post.location_lng = req.body.location_lng;
  if (req.body.picture) {
    Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

    filename = req.body._user.toString() + timeStamp + '.jpg';
    post.picture = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  }
  if (req.body.audio) {
    Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

    filename = req.body._user.toString() + 'audio' + timeStamp + '.wav';
    post.audio = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  }
  if (req.body.video) {
    Uploads.uploadVideo(req.body.video, req.body._user.toString(), timeStamp);

    filename = req.body._user.toString() + timeStamp + '.wav';
    post.video = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  }

  post.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(post);
    }
  });
};

api.updatePost = function (req, res) {
  Post.findById(req.params.post_id, function (err, post) {
    if (!post || err) {
      res.status(400).send('Post não encontrado!');
    } else {
      var date = new Date();
      var timeStamp = date.toLocaleString();
      let filename;
      if (req.body.text_msg) post.text_msg = req.body.text_msg;
      if (req.body.picture) {
        Uploads.uploadFile(req.body.picture, req.body._user.toString(), timeStamp);

        filename = req.body._user.toString() + timeStamp + '.jpg';
        post.picture = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
      }
      if (req.body.audio) {
        Uploads.uploadAudio(req.body.audio, req.body._user.toString(), timeStamp);

        filename = req.body._user.toString() + timeStamp + '.wav';
        post.audio = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
      }
      if (req.body.video) {
        Uploads.uploadVideo(req.body.video, req.body._user.toString(), timeStamp);

        filename = req.body._user.toString() + timeStamp + '.wav';
        post.video = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
      }
      if (req.body.location_lat) post.location_lat = req.body.location_lat;
      if (req.body.location_lng) post.location_lng = req.body.location_lng;
      if (req.body.points) post.points = req.body.points;

      post.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(post);
        }
      });
    }
  });
};

api.deletePost = function (req, res) {
  Post.remove({ _id: req.params.post_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('POst removido.');
    }
  });
};

async function getAuthorInfo (post) {
  let string = JSON.stringify(post);
  let postComplete = JSON.parse(string);
  let userObj = await User.findById(post._user).exec();

  postComplete.author_name = userObj.name;
  postComplete.author_photo = userObj.picture;

  return postComplete;
}
