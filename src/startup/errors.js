const logger = require('../config/winston');

module.exports = app => {
  app.use((req, res, next) => {
    const err = new Error('Resource not found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    logger.error(err.stack);
    res.status(status).send('Internal server error');
  });
};

process.on('uncaughtException', err => {
  console.log(err);
});

process.on('unhandledRejection', err => {
  throw err;
});
