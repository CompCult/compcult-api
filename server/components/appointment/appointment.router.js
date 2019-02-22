var express = require('express');
var router = express.Router();

var Appointment = require('./appointment.model');
var AppointmentRequest = require('../appointmentRequest/appointmentRequest.model');

// Index
router.get('/', function (req, res) {
  Appointment.find({}, function (err, appointments) {
    if (err) {
      res.status(400).send(err);
    } else {
      let date = new Date();

      const results = appointments.filter(function (appointment) {
        let end = new Date(appointment.end_date);
        end.setHours(23, 59, 0);
        return (end >= date);
      });

      res.status(200).json(results);
    }
  });
});

// Find by params
router.get('/query/fields', function (req, res) {
  Appointment.find(req.query, function (err, event) {
    if (err) {
      res.status(400).send(err);
    } else if (!event) {
      res.status(404).send('Evento não encontrado');
    } else {
      res.status(200).json(event);
    }
  });
});

// Show
router.get('/:appointment_id', function (req, res) {
  Appointment.findById(req.params.appointment_id, function (err, appointment) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(appointment);
    }
  });
});

// Create
router.post('/', function (req, res) {
  var appointment = new Appointment();
  appointment._user = req.body._user;
  appointment.name = req.body.name;
  appointment.description = req.body.description;
  appointment.place = req.body.place;
  appointment.type = req.body.type;

  let startTime = new Date(req.body.start_date);
  let endTime = new Date(req.body.end_date);
  startTime.setHours(23, 59, 0);
  endTime.setHours(23, 59, 0);
  appointment.start_date = startTime;
  appointment.end_date = endTime;

  appointment.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(appointment);
    }
  });
});

// Update
router.put('/:appointment_id', function (req, res) {
  Appointment.findById(req.params.appointment_id, function (err, appointment) {
    if (err) throw err;

    if (req.body.name) appointment.name = req.body.name;
    if (req.body.description) appointment.description = req.body.description;
    if (req.body.place) appointment.place = req.body.place;
    if (req.body.type) appointment.type = req.body.type;
    if (req.body.start_date) {
      const startDate = new Date(req.body.start_date);
      startDate.setHours(23, 59, 0);
      appointment.start_date = startDate;
    }
    if (req.body.end_date) {
      const endDate = new Date(req.body.end_date);
      endDate.setHours(23, 59, 0);
      appointment.end_date = endDate;
    }

    appointment.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(appointment);
      }
    });
  });
});

// Delete
router.delete('/:appointment_id', function (req, res) {
  Appointment.remove({ _id: req.params.appointment_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeAppointmentRequests(req.params.appointment_id);

      res.status(200).send('Compromisso removido.');
    }
  });
});

var removeAppointmentRequests = function (id) {
  AppointmentRequest.deleteMany({ _appointment: id }).exec();
};

module.exports = router;
