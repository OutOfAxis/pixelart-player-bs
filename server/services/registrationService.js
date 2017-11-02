const databaseService = require('./databaseService');
const communication = require('../utils/communication');
const co = require('co');
const requestPromise = require('request-promise');
const uuid = require('uuid-v4');

function getAndSetUniversallyUniqueIdentifier() {
  const identifier = uuid();
  databaseService.initializeDeviceIdentifier(identifier);
  return identifier;
}

function sendVerificationMessage(token) {
  return co(function* () {
    token = '47b129c';

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
      console.log(error);
    }
  });
}

function registerDevice() {
  return databaseService.getDeviceIdentifier()
  .then((result) => {
    console.log(result);
    if (result.length === 0) {
      return sendVerificationMessage();
    }
  });
}


module.exports = {
  registerDevice,
};
