const log4js = require('log4js');

log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: 'all-the-logs.log',
    },
    default: {
      'type': 'console',
      'level': 'TRACE',
      'category': 'default',
    },
  },
  categories: {
    default: { appenders: ['everything', 'default'], level: 'debug' },
  },
});

module.exports = {
  logger: log4js.getLogger('default'),
};
