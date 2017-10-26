const requestPromise = require('request-promise');
const uuid = require('uuid-v4');
const configurationService = require('./configurationService');

const API_URL = 'http://b.pixelart.ge:5300/api/1/player/register/';

function linkDeviceWithUniversallyUniqueIdentifier(identifier) {
    // TODO: SAVE UUID to local file or local DB
}
function getAndSetUniversallyUniqueIdentifier() {
  const identifier = uuid();
  linkDeviceWithUniversallyUniqueIdentifier(identifier);
  return identifier;
}

async function sendVerificationMessage(token) {
  token = 'bac5e69';

  const options = {
    method: 'PUT',
    uri: API_URL + token,
    formData: {
      secret: getAndSetUniversallyUniqueIdentifier()
    },
    json: false
  };

  try {
    const response = JSON.parse(await requestPromise(options));
    console.log(response);
    configurationService.initializeConfigurationAndDatabase(response);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendVerificationMessage
};
