const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { validateUser } = require('./user.model');

const userController = require('./user.controller');

router.get('/', userController.listUsers);

router.get('/:user_id', userController.findUserById);

router.get('/query/fields', userController.listUsers);

router.post('/register', validate(validateUser), userController.createUser);

router.post('/recovery/password_edit', userController.updatePassword);

router.post('/recovery', userController.recoveryPassword);

router.post('/update/:user_id', userController.updateUser);

router.put('/:user_id', userController.updateUser);

router.post('/auth', userController.authenticate);

router.delete('/:user_id', userController.deleteUser);

module.exports = router;
