const communication = require('../utils/config');
const databaseService = require('../services/databaseService');
const messagingService = require('../services/requestService');
const encryption = require('../utils/encryption');

const WebSocket = require('ws');

async function establishConnectionWithWebSocket() {
  const configuration = await databaseService.getConfiguration();
  const url = await communication.getWebSocketAddress(configuration.serverUri, configuration.id);
  const authorizationToken = `${configuration.id}:${configuration.password}`;
  const ws = new WebSocket(url, {
    perMessageDeflate: false,
    headers: {
      Authorization: `Basic ${encryption.encode(authorizationToken)}`,
    },
  });

  ws.on('open', function open() {
    console.log('Connection to WebSocket has been established.');
  });

  ws.on('connection', function open() {
    console.log('connectged');
  });

  ws.on('message', function incoming(data) {
    if (data) {
      messagingService.handleMessage(data, ws);
    }
  });

  ws.on('close', function close() {
    console.log('Disconnected, trying establish new connection');
    establishConnectionWithWebSocket();
  });

  setTimeout(function timeout() {
    ws.send(null, function(error) {
      if (error) {
        establishConnectionWithWebSocket();
      }
    });
  }, 500);
}

module.exports = {
  establishConnectionWithWebSocket,
};