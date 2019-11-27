const express = require('express');
const router = express.Router();

const appointmentCtrl = require('./appointment.controller');
const { authorize } = require('../user/user.middlewares');
const { userTypes } = require('../user/user.model');

router.get('/', authorize(), appointmentCtrl.listAppointments);

router.get('/query/fields', authorize(), appointmentCtrl.findAppointmentByParams);

router.get('/:appointment_id', authorize(), appointmentCtrl.getAppointment);

router.post('/', authorize(userTypes.TEACHER), appointmentCtrl.createAppointment);

router.put('/:appointment_id', authorize(userTypes.TEACHER), appointmentCtrl.updateAppointment);

router.delete('/:appointment_id', authorize(userTypes.TEACHER), appointmentCtrl.deleteAppointment);

module.exports = router;
