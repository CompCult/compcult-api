const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { User, userTypes } = require('./user.model');
const Uploads = require('../../upload');
const Mailer = require('../../mailer');
const utils = require('../../utils');
const config = require('config');

async function listUsers(req, res) {
  const query = _.omit(req.query, ['page', 'limit']);
  const regexProperties = ['name'];
  const regexQuery = utils.regexQuery(query, regexProperties);

  if (req.query.page) {
    if (!req.query.limit) res.status(400).send('A page parameter was passed without limit');

    const config = {
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    };
    const users = await User.paginate(regexQuery, config);
    res.send(users);
  } else {
    const users = await User.find(regexQuery);
    res.send(users);
  }
}

function findUserById(req, res) {
  User.findById(req.params.user_id, function (err, usuario) {
    if (err) {
      res.status(400).send(err);
    } else if (!usuario) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.status(200).json(usuario);
    }
  });
}

async function createUser(req, res, next) {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send(_.omit(user.toJSON(), 'password'));
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).send('Usuário já existente.');
    } else {
      next(err);
    }
  }
}

function updatePassword(req, res) {
  User.findOne({ email: req.query.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(404).send('Usuário não encontrado');
    } else {
      if (user.new_password) {
        user.password = user.new_password;
        user.new_password = null;

        user.save(function (err) {
          if (err) {
            return res.status(403).send(err);
          } else {
            return res.status(200).send('Senha atualizada!');
          }
        });
      } else {
        return res.status(404).send('Nova senha não encontrada, tente novamente.');
      }
    }
  });
}

function recoveryPassword(req, res) {
  let userEmail = req.body.email;
  let html = "<div style='width:90%; margin-left:auto; margin-right:auto; margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px;'>" +
    "<div style='font-family: Arial; border-color: #502274;'>" +
    "<div style='vertical-align:middle; text-align:justify;'>" +
    "<p style='text-align:left;'>Olá!</p>" +
    '<p>Você está recebendo esse e-mail que foi requisitada a alteração da sua senha de acesso. Se você não fez nenhuma requisição, pode simplesmente ignorar este e-mail.</p>' +
    '<p>Para confirmar a alteração da senha, clique no botão abaixo:</p>' +
    "<form action='" + config.get('PASS_EDIT') + req.body.email + "' method='post'>" +
    "<input type='submit' value='Confirmar alteração de senha' style='margin-top:3px; margin-bottom:3px; background: #502274; margin-bottom: 3px; padding: 10px; text-align: center; color: white; font-weight: bold; border: 1px solid #502274;'></form>" +
    "<p style='text-align:left;' >Bom uso,</p>" +
    "<p style='text-align:left;' ><b>Equipe LerAtos!</b></p>" +
    '</div></div></div>';

  User.findOne({ email: userEmail }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    } if (!user) {
      res.status(400).send(err);
    } else {
      bcrypt.hash(req.body.new_password, 10, function (err, hash) {
        if (err) {
          res.status(400).send(err);
        } else {
          user.new_password = hash;
          user.save(function (err) {
            if (err) {
              return res.status(400).send(err);
            } else {
              Mailer.sendMail(userEmail, 'Recuperação de senha', html);
              res.status(200).send(user);
            }
          });
        }
      });
    }
  });
}

function updateUser(req, res) {
  User.findById(req.params.user_id, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.status(400).send('Usuário não encontrado!');
    }

    if (req.body.can_edit != null) {
      if (req.user.type == userTypes.MANAGER) {
        user.can_edit = req.body.can_edit;
      } else {
        res.status(401).send('Apenas gerentes podem alterar as permissões dos usuários!');
      }
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.type) user.type = req.body.type;
    if (req.body.institution) user.institution = req.body.institution;
    if (req.body.birth) user.birth = new Date(req.body.birth);
    if (req.body.sex) user.sex = req.body.sex;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.street) user.street = req.body.street;
    if (req.body.complement) user.complement = req.body.complement;
    if (req.body.number) user.number = req.body.number;
    if (req.body.neighborhood) user.neighborhood = req.body.neighborhood;
    if (req.body.city) user.city = req.body.city;
    if (req.body.state) user.state = req.body.state;
    if (req.body.zipcode) user.zipcode = req.body.zipcode;
    if (req.body.lux) user.lux = req.body.lux;
    if (req.body.sec_points) user.sec_points = req.body.sec_points;
    if (req.body.resources) user.resources = req.body.resources;
    if (req.body.imp) user.imp = req.body.imp;
    if (req.body.people) user.people = req.body.people;
    if (req.body.request_limit) user.request_limit = req.body.request_limit;
    if (req.body.banned_until) {
      let banned = new Date(req.body.banned_until);
      banned.setHours(23, 59, 0);
      user.banned_until = banned;
    }
    if (req.body.picture) {
      var date = new Date();
      var timeStamp = date.toLocaleString();
      var filename = req.params.user_id.toString() + timeStamp + '.jpg';

      Uploads.uploadFile(req.body.picture, req.params.user_id.toString(), timeStamp);
      user.picture = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
    };

    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) throw err;

        user.password = hash;
        user.save(function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send('Usuário atualizado.');
          }
        });
      });
    } else {
      user.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send('Usuário atualizado.');
        }
      });
    }
  });
}

async function authenticate(req, res) {
  const user = await User.findOne({ 'email': req.body.email });

  if (!user) {
    return res.status(404).send('Usuário não encontrado.');
  }

  if (_userIsBanned(user.banned_until)) {
    return res.status(400).send('Usuário banido até ' + user.banned_until.toLocaleString());
  }

  if (! await user.comparePassword(req.body.password)) {
    return res.status(401).json('Senha incorreta.');
  }

  res.send({
    ..._.omit(user.toJSON(), ['password']),
    token: user.generateToken()
  });
}

const refreshToken = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(user.generateToken());
};

function deleteUser(req, res) {
  User.remove({ _id: req.params.user_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Usuário removido.');
    }
  });
}

function _userIsBanned(date) {
  if (date) {
    const now = new Date();
    if (date.getTime() > now.getTime()) {
      return true;
    }
  }

  return false;
}

module.exports = {
  listUsers,
  findUserById,
  createUser,
  updatePassword,
  recoveryPassword,
  updateUser,
  authenticate,
  refreshToken,
  deleteUser
};
