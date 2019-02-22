var express = require('express');
var router = express.Router();

const appointmentCtrl = require('./appointment.controller');

router.get('/', appointmentCtrl.listAppointments);

router.get('/query/fields', appointmentCtrl.findAppointmentByParams);

router.get('/:appointment_id', appointmentCtrl.getAppointment);

router.post('/', appointmentCtrl.createAppointment);

router.put('/:appointment_id', appointmentCtrl.updateAppointment);

router.delete('/:appointment_id', appointmentCtrl.deleteAppointment);

module.exports = router;
