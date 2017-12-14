const databaseService = require('./databaseService');
const communication = require('../utils/config');
const co = require('co');
const requestPromise = require('request-promise');
const uuid = require('uuid-v4');
const logger = require('../utils/logger').logger;

function getAndSetUniversallyUniqueIdentifier() {
  const identifier = uuid();
  databaseService.initializeDeviceIdentifier(identifier);
  return identifier;
}

function registerDevice() {
  return databaseService.getConfiguration()
    .then((result) => {
      if (result.config === null || result.config.playerId === null) {
        return sendVerificationMessage();
      }
    }).catch((err)=>{
      logger.error(err);
    });
}

function sendVerificationMessage(token) {
  return co(function* () {
    token = '90a2a77';
    const options = {
      method: 'PUT',
      uri: `${communication.REST_API_URL}${token}`,
      formData: {
        secret: getAndSetUniversallyUniqueIdentifier(),
      },
      json: false,
    };

    try {
      const response = JSON.parse(yield requestPromise(options));
      return databaseService.insertConfiguration(null, response);
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  registerDevice,
};
