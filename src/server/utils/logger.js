require('../../../node_modules/log4js/lib/appenders/console');
require('../../../node_modules/log4js/lib/appenders/stdout');
process.stdout = require('browser-stdout')()

const log4js = require('log4js');
process.stdout = require('browser-stdout')()
const config = require('./config');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: `${config.LOCAL}/all-the-logs.log`,
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