const registrationService = require('./server/services/registrationService');
const webSocketService = require('./server/services/webSocketService');
const db = require('./server/services/databaseService');
//registrationService.sendVerificationMessage();
webSocketService.establishConnectionWithWebSocket();
