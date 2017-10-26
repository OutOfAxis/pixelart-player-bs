const service = require('./server/services/registrationService');
const configurationService = require('./server/services/configurationService');

configurationService.initializeConfigurationAndDatabase();
// service.sendVerificationMessage();