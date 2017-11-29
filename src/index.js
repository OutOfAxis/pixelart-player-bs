require('babel-register')({
  retainLines: true,
});
//require('babel-polyfill');
console.log('hey yopu');

const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');
const fileHandler = require('./server/utils/fileHandler');
const config = require('./server/utils/config');
const logger = require('./server/utils/logger').logger;
logger.info('One');
(async function() {
  logger.info('Two');
  await fileHandler.initDirectories(config.CONTENT_ADDRESS);
  logger.info('Thr33');
  await registrationService.registerDevice();
  logger.info('4our');
  webSocket.establishConnectionWithWebSocket();
})();

