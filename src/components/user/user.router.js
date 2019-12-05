const express = require('express');
const router = express.Router();
const validate = require('../../validate');
const { validateUser } = require('./user.model');

const userController = require('./user.controller');
const userMiddleware = require('./user.middlewares');
const { userTypes } = require('./user.model');

router.get('/', userMiddleware.authorize(), userController.listUsers);

router.get('/:user_id', userMiddleware.authorize(), userController.findUserById);

router.get('/query/fields', userMiddleware.authorize(userTypes.TEACHER), userController.listUsers);

router.post('/register', validate(validateUser), userController.createUser);

router.post('/recovery/password_edit', userController.updatePassword);

router.post('/recovery', userController.recoveryPassword);

router.post('/update/:user_id', userMiddleware.authorize(), userController.updateUser);

router.put('/:user_id', userMiddleware.authorize(), userController.updateUser);

router.post('/auth', userController.authenticate);

router.post('/refresh-token', userMiddleware.authorize(), userController.refreshToken);

router.delete('/:user_id', userMiddleware.authorize(), userController.deleteUser);

module.exports = router;
