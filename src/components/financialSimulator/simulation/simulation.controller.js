const Simulation = require('./simulation.model');

exports.getAll = async (req, res) => {
  const simulations = await Simulation.find({ _user: req.user.id });

  res.send(simulations);
};

exports.get = async (req, res) => {
  res.send(req.simulation);
};

exports.create = async (req, res) => {
  const simulation = new Simulation({
    ...req.body,
    '_user': req.user.id,
    'secretCode': generateSecretCode()
  });
  await simulation.save();
  res.send(simulation);
};

exports.update = async (req, res) => {
  req.simulation.set(req.body);
  await req.simulation.save();
  res.send(req.simulation);
};

exports.remove = async (req, res) => {
  await req.simulation.delete();
  res.send(req.simulation);
};

function generateSecretCode() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};
