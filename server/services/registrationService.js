const requestPromise = require('request-promise');
const uuid = require('uuid-v4');
const configurationService = require('./configurationService');

const API_URL = 'pixelart.ge:5300';
const REST_URL = '/api/1/player/register/';

function linkDeviceWithUniversallyUniqueIdentifier(identifier) {
    // TODO: SAVE UUID to local file or local DB
}
function getAndSetUniversallyUniqueIdentifier() {
  const identifier = uuid();
  linkDeviceWithUniversallyUniqueIdentifier(identifier);
  return identifier;
}

async function sendVerificationMessage(token) {
  token = '5253bf2';

  const options = {
    method: 'PUT',
    uri: `http://${ API_URL }${REST_URL }${token}`,
    formData: {
      secret: getAndSetUniversallyUniqueIdentifier()
    },
    json: false
  };

  try {
    const response = JSON.parse(await requestPromise(options));
    configurationService.initializeConfigurationAndDatabase(response);
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  API_URL,
  sendVerificationMessage,
};
