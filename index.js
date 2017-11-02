const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');

registrationService.registerDevice()
  .then(() => {
    return webSocket.establishConnectionWithWebSocket();
  })
  .catch((error) => {
    console.error(error);
  });

