require('babel-register')({
  retainLines: true,
});

const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');
const fileHandler = require('./server/utils/fileHandler');
const config = require('./server/utils/config');

(async function() {
  await fileHandler.initDirectories(config.CONTENT_ADDRESS);
  await registrationService.registerDevice();
  webSocket.establishConnectionWithWebSocket();
})();
