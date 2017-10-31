const databaseService = require('./databaseService');
const communication = require('../utils/communication');
const co = require('co');
const requestPromise = require('request-promise');
const uuid = require('uuid-v4');


function linkDeviceWithUniversallyUniqueIdentifier(identifier) {
  // TODO: SAVE UUID to local file or local DB
}

function getAndSetUniversallyUniqueIdentifier() {
  const identifier = uuid();
  linkDeviceWithUniversallyUniqueIdentifier(identifier);
  return identifier;
}

function sendVerificationMessage(token) {
  return co(function* () {
    token = '5253bf2';

    const options = {
      method: 'PUT',
      uri: `${communication.REST_API_URL}${token}`,
      formData: {
        secret: getAndSetUniversallyUniqueIdentifier()
      },
      json: false
    };

    try {
      const response = JSON.parse(yield requestPromise(options));
      databaseService.initializeConfigurationDataSet(response);
    } catch (error) {
      console.log(error);
    }
  });
}


module.exports = {
  sendVerificationMessage,
};
