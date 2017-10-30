const configurationService = require('./configurationService');
const encryptionService = require('./encryptionService');
const registrationService = require('./registrationService');
const WebSocket = require('ws');

function establishConnectionWithWebSocket() {
  return configurationService.getUserAndPasswordFromConfiguration()
    .then((config) => {
      const url = `ws://${registrationService.API_URL}/api/1/player/${config.playerId}/ws`;
      const userpass = `${config.playerId}:${config.password}`;
      const ws = new WebSocket(url, {
        perMessageDeflate: false,
        headers: {
          Authorization: `Basic ${encryptionService.encode(userpass)}=`
        }
      });
      
      ws.on('open', function open() {
        console.log('connected');
      });
    });
}

module.exports = {
  establishConnectionWithWebSocket
};
