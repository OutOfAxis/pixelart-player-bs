const SockJS = require('sockjs-client');
const configurationService = require('./configurationService');
const encryptionService = require('./encryptionService');
const registrationService = require('./registrationService');

function establishConnectionWithWebSocket() {
  return configurationService.getUserAndPasswordFromConfiguration()
    .then((config) => {
      const url = `http://${encryptionService.encode(config.user)}:
    ${encryptionService.encode(config.password)}${registrationService.API_URL}${'/player/'}${config.playerId}${'/ws'}`;
      const sock = new SockJS(url);

      sock.onopen = function() {
        console.log('open');
      };
      sock.onmessage = function(e) {
        console.log('message', e.data);
      };
      sock.onclose = function() {
        console.log('close');
      };

      sock.send('test');
      sock.close();
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  establishConnectionWithWebSocket
};
