const jwt = require('jsonwebtoken');
const config = require('config');
const { userTypes } = require('./user.model');

const api = module.exports;

api.authorize = (authorizationLevel) => async (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) return res.status(401).send('Access denied. No token provided.');
  if (token.split(' ').length < 2) return res.status(401).send('Invalid token, rember to put the Bearer prefix');

  token = token.split(' ')[1];

  try {
    req.user = jwt.verify(token, config.get('jwtSecret'));
  } catch (ex) {
    return res.status(401).send('Invalid token');
  }

  if (authorizationLevel && !checkAuthorizationLevel(authorizationLevel, req.user.type)) {
    return res.status(401).send('You do not have the permission level required to access this feature.');
  }

  next();
};

function checkAuthorizationLevel (authorizationLevel, userType) {
  const levels = [userTypes.MANAGER, userTypes.TEACHER, userTypes.STUDENT];
  let result = false;

  switch (authorizationLevel) {
    case userTypes.MANAGER:
      result = levels.slice(0, 1).includes(userType);
      break;
    case userTypes.TEACHER:
      result = levels.slice(0, 2).includes(userType);
      break;
    case userTypes.STUDENT:
      result = levels.slice(0, 3).includes(userType);
  }

  console.log(result);
  return result;
}

api.teacher = (req, res, next) => {
  if (![
    userTypes.MANAGER,
    userTypes.TEACHER
  ].includes(req.user.type)) {
    return res.status(401).send('You do not have the permission level required to access this feature.');
  }

  next();
};
