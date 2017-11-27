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
  return databaseService.getDeviceIdentifier()
    .then((result) => {
      if (result.length === 0) {
        return sendVerificationMessage();
      }
    }).catch((err)=>{
      logger.error(err);
    });
}

function sendVerificationMessage(token) {
  return co(function* () {
    token = '3cfa6a5';

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
      return databaseService.insertConfiguration(response);
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  registerDevice,
};
