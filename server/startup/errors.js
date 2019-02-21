module.exports = app => {
  app.use((req, res, next) => {
    const err = new Error('Resource not found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
  });
};

process.on('uncaughtException', err => {
  console.log(err);
});

process.on('unhandledRejection', err => {
  throw err;
});
