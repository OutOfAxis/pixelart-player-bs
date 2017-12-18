const databaseService = require('./databaseService');
const communication = require('../utils/config');
const co = require('co');
const requestPromise = require('request-promise');
const logger = require('../utils/logger').logger;

function registerDevice() {
  return databaseService.getConfiguration()
    .then((result) => {
      if (!result.registered) {
        return sendVerificationMessage(result);
      }
    }).catch((err)=>{
      logger.error(err);
    });
}

function sendVerificationMessage(configuration) {
  return co(function* () {
    const options = {
      method: 'PUT',
      uri: `${communication.REST_API_URL}${configuration.token}`,
      formData: {
        secret: configuration.id,
      },
      json: false,
    };

    try {
      yield requestPromise(options);
      return databaseService.updateConfiguration('registered', true);
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  registerDevice,
};
