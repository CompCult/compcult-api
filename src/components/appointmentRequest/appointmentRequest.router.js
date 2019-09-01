var express = require('express');
var router = express.Router();

const appointmentCtrl = require('./appointmentRequest.controller');

router.get('/', appointmentCtrl.listAppointmentRequests);

router.get('/:request_id', appointmentCtrl.getAppointmentRequest);

router.get('/query/fields', appointmentCtrl.findAppointmentRequestByParams);

router.post('/', appointmentCtrl.createAppointmentRequest);

router.put('/:request_id', appointmentCtrl.updateAppointmentRequest);

router.delete('/:request_id', appointmentCtrl.deleteAppointmentRequest);

module.exports = router;
