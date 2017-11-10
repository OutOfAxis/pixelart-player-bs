require('babel-polyfill');
require('babel-register')({
  retainLines: true,
});

const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');

(async function() {
  await registrationService.registerDevice();
  webSocket.establishConnectionWithWebSocket();
})();