const SockJS = require('sockjs-client');
const configurationService = require('./configurationService');
const encryptionService = require('./encryptionService');
const registrationService = require('./registrationService');
const WebSocket = require('ws');
const io = require('socket.io-client');

function establishConnectionWithWebSocket() {
  return configurationService.getUserAndPasswordFromConfiguration()
    .then((config) => {
      const url = `ws://${registrationService.API_URL}${'/player/'}${config.playerId}${'/ws'}`;
      // var missing part = ${encryptionService.encode(config.user)}:${encryptionService.encode(config.password)}$;
    //   const sock = new SockJS(url);
    //
    //   sock.onopen = function() {
    //     console.log('open');
    //   };
    //   sock.onmessage = function(e) {
    //     console.log('message', e.data);
    //   };
    //   sock.onclose = function() {
    //     console.log('close');
    //   };
    //
    //   setInterval(function() {
    //     console.log('...');
    //   }, 10000);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
      const userpass = `${config.user}:${config.password}`;
      const socket = io.connect(url, {
        reconnect: true,
        extraHeaders: {
          Authorization: `Basic ${encryptionService.encode(userpass)}`
        }
      });

// Add a connect listener
      socket.on('connect', function(socket) {
        console.log('Connected!');
      });
      socket.on('error', function(error) {
        console.log(error);
      });
      socket.on('close', function() {
        console.log('closed connection');
      });
      socket.on('event', function(data) {
        console.log(data);
      });

      setInterval(function() {
        console.log('...');
      }, 10000);

      socket.emit('CH01', 'me', 'test msg');
      console.log('Message sent');
      socket.close();
    });
}

module.exports = {
  establishConnectionWithWebSocket
};
