var Reaction = require('./reaction.model');

const api = module.exports;

api.listReactions = function (req, res) {
  Reaction.find({}, function (err, reactions) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(reactions);
    }
  });
};

api.findReactionByParams = function (req, res) {
  Reaction.find(req.query, function (err, reaction) {
    if (err) {
      res.status(400).send(err);
    } else if (!reaction) {
      res.status(404).send('Reação não encontrada');
    } else {
      res.status(200).json(reaction);
    }
  });
};

api.addLike = function (req, res) {
  Reaction.findOne({ _user: req.body._user, _post_reacted: req.body._post_reacted }, function (err, reaction) {
    if (err) throw err;

    if (reaction) {
      console.log('update');
      reaction.points += req.body.points;

      reaction.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send('Você reagiu!');
        }
      });
    } else {
      console.log('create');
      var react = new Reaction();
      react._user = req.body._user;
      react._post_reacted = req.body._post_reacted;
      react.points = req.body.points;

      react.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(react);
        }
      });
    }
  });
};

api.deleteReaction = function (req, res) {
  Reaction.remove({ _id: req.params.reaction_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Reação removida.');
    }
  });
};
