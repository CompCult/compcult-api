var express = require('express');
var router = express.Router();

const appointmentCtrl = require('./appointmentRequest.controller');
const { authorize } = require('../user/user.middlewares');

router.get('/', authorize(), appointmentCtrl.listAppointmentRequests);

router.get('/:request_id', authorize(), appointmentCtrl.getAppointmentRequest);

router.get('/query/fields', authorize(), appointmentCtrl.findAppointmentRequestByParams);

router.post('/', authorize(), appointmentCtrl.createAppointmentRequest);

router.put('/:request_id', authorize(), appointmentCtrl.updateAppointmentRequest);

router.delete('/:request_id', authorize(), appointmentCtrl.deleteAppointmentRequest);

module.exports = router;
