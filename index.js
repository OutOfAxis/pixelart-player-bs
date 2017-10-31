const registrationService = require('./server/services/registrationService');
const webSocket = require('./server/infrastructure/webSocket');

//registrationService.sendVerificationMessage();
webSocket.establishConnectionWithWebSocket();
