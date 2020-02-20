const jwt = require('jsonwebtoken');
const config = require('config');
const { User, userTypes } = require('./user.model');

const api = module.exports;

api.authorize = (authorizationLevel, verifyEditPermission) => async (req, res, next) => {
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

  if (verifyEditPermission && req.user.type != userTypes.MANAGER){
    const user = await User.findById(req.user.id);
    if(user && !user.can_edit) return res.status(401).send('You do not have the permission level required to access this feature.');
  }
  
  next();
};

function checkAuthorizationLevel (authorizationLevel, userType) {
  let result = false;

  switch (authorizationLevel) {
    case userTypes.MANAGER:
      result = userType === userTypes.MANAGER;
      break;
    case userTypes.TEACHER:
      result = userType === userTypes.MANAGER || userType === userTypes.TEACHER;
      break;
    case userTypes.STUDENT:
      result = userType === userTypes.MANAGER || userType === userTypes.STUDENT;
  }
  return result;
}
