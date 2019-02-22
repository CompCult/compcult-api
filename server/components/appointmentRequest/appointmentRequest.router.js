var express = require('express');
var router = express.Router();

var User = require('../user/user.model.js');
var Appointment = require('../appointment/appointment.model.js');
var AppointmentRequest = require('./appointmentRequest.model.js');

// Index
router.get('/', function (req, res) {
  AppointmentRequest.find({}, function (err, requests) {
    if (err) {
      res.status(400).send(err);
    } else {
      let promises;

      try {
        promises = requests.map(injectAppointment);
      } catch (err) {
        res.status(400).send(err);
      }

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    }
  });
});

var injectAppointment = async function (request) {
  let string = JSON.stringify(request);
  let requestComplete = JSON.parse(string);

  let userObj = await User.findById(request._user).exec();
  let appointmentObj = await Appointment.findById(request._appointment).exec();

  requestComplete._user = userObj;
  requestComplete._appointment = appointmentObj;

  return requestComplete;
};

// Show
router.get('/:request_id', function (req, res) {
  AppointmentRequest.findById(req.params.request_id, function (err, request) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(request);
    }
  });
});

// Find by params
router.get('/query/fields', function (req, res) {
  AppointmentRequest.find(req.query, function (err, event) {
    if (err) {
      res.status(400).send(err);
    } else if (!event) {
      res.status(404).send('Evento não encontrado');
    } else {
      let promises;

      try {
        promises = event.map(injectAppointment);
      } catch (err) {
        res.status(400).send(err);
      }

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    }
  });
});

// Create
router.post('/', function (req, res) {
  var request = new AppointmentRequest();
  request._user = req.body._user;
  request._appointment = req.body._appointment;
  request.status = req.body.status;
  request.message = req.body.message;
  request.updated_at = new Date();

  request.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(request);
    }
  });
});

// Update
router.put('/:request_id', function (req, res) {
  AppointmentRequest.findById(req.params.request_id, function (err, request) {
    if (err) throw err;

    if (req.body._appointment) request._appointment = req.body._appointment;
    if (req.body.status) {
      request.status = req.body.status;
      console.log(request);
      request.updated_at = new Date();
    }
    if (req.body.message) request.message = req.body.message;

    request.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(request);
      }
    });
  });
});

// Delete
router.delete('/:request_id', function (req, res) {
  AppointmentRequest.remove({ _id: req.params.request_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Compromisso removido.');
    }
  });
});

module.exports = router;
