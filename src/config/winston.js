const appRoot = require('app-root-path');
const { format, transports, createLogger } = require('winston');

const options = {
  error: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    format: format.combine(format.timestamp(), format.json())
  },
  activity: {
    level: 'info',
    filename: `${appRoot}/logs/activity.log`,
    format: format.combine(format.timestamp(), format.json())
  },
  console: {
    level: 'debug',
    format: format.combine(format.colorize(), format.simple())
  }
};

const logger = createLogger({
  transports: [
    new transports.File(options.error),
    new transports.File(options.activity),
    new transports.Console(options.console)
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};

module.exports = logger;
