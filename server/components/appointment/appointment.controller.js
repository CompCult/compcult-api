const Appointment = require('./appointment.model');
const AppointmentRequest = require('../appointmentRequest/appointmentRequest.model');

const api = module.exports;

api.listAppointments = (req, res) => {
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
};

api.findAppointmentByParams = (req, res) => {
  Appointment.find(req.query, function (err, event) {
    if (err) {
      res.status(400).send(err);
    } else if (!event) {
      res.status(404).send('Evento não encontrado');
    } else {
      res.status(200).json(event);
    }
  });
};

api.getAppointment = (req, res) => {
  Appointment.findById(req.params.appointment_id, function (err, appointment) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(appointment);
    }
  });
};

api.createAppointment = (req, res) => {
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
};

api.updateAppointment = (req, res) => {
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
};

api.deleteAppointment = (req, res) => {
  Appointment.remove({ _id: req.params.appointment_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      removeAppointmentRequests(req.params.appointment_id);

      res.status(200).send('Compromisso removido.');
    }
  });
};

function removeAppointmentRequests (id) {
  AppointmentRequest.deleteMany({ _appointment: id }).exec();
}
