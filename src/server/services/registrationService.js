const databaseService = require('./databaseService');
const communication = require('../utils/config');
const co = require('co');
const requestPromise = require('request-promise');
const logger = require('../utils/logger').logger;

async function registerDevice() {
  return await databaseService.getConfiguration()
    .then((result) => {
      if (!result.registered) {
        const url = `${communication.getAPIAddress(result.serverUri)}${result.token}`;
        console.log(url);
        return sendVerificationMessage(result, url);
      }
    }).catch((err)=>{
      logger.error(err);
    });
}

function sendVerificationMessage(configuration, url) {
  console.log(url);
  return co(function* () {
    const options = {
      method: 'PUT',
      uri: url,
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
