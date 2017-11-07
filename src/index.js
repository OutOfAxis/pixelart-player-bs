require('babel-core/register');
require('babel-polyfill');

const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');

(async function() {
  await registrationService.registerDevice();
  webSocket.establishConnectionWithWebSocket();
})();
