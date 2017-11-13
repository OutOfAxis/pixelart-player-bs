require('babel-register')({
  retainLines: true,
});

const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');
const fileHandler = require('./server/utils/fileHandler');

(async function() {
  await fileHandler.getResourcesDetails();
  await fileHandler.initDirectories();
  await registrationService.registerDevice();
  webSocket.establishConnectionWithWebSocket();
})();
