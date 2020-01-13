const Simulation = require('./simulation.model');

exports.getSimulation = async (req, res, next) => {
  const simulation = await Simulation.findById(req.params.simulationId);
  if (!simulation) return res.status(404).send('Simulation not found');

  req.simulation = simulation;
  next();
};
