const express = require('express');
const config = require('config');

const app = express();

require('./startup/logger')(app);
require('./startup/cors')(app);
require('./startup/parser')(app);
require('./startup/db')();

app.get('/', (req, res) => res.send('This API is running, baby!'));

require('./startup/routes')(app);

require('./startup/errors')(app);

const port = config.get('port');

const server = app.listen(port, () =>
  console.log(`Listen on port ${port}`)
);

module.exports = server;
