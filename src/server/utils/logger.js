const log4js = require('log4js');
const config = require('./config');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: `${config.LOCAL }/storage/sd/all-the-logs.log`,
    },
    default: {
      'type': 'console',
      'level': 'TRACE',
      'category': 'default',
    },
  },
  categories: {
    default: { appenders: ['file', 'default'], level: 'debug' },
  },
});

module.exports = {
  logger: log4js.getLogger('default'),
};
