const databaseService = require('../services/databaseService');
const messagingService = require('../services/messagingService');
const encryption = require('../utils/encryption');
const communication = require('../utils/config');

const WebSocket = require('ws');

async function establishConnectionWithWebSocket() {
  const config = await databaseService.getConfiguration();
  const url = `${communication.WS_API_URL}${config.playerId}/ws`;
  const authorizationToken = `${config.playerId}:${config.password}`;
  const ws = new WebSocket(url, {
    perMessageDeflate: false,
    headers: {
      Authorization: `Basic ${encryption.encode(authorizationToken)}`,
    },
  });

  ws.on('open', function open() {
    console.log('Connection to WebSocket has been established.');
  });

  ws.on('message', function incoming(data) {
    if (data) {
      messagingService.handleMessage(data, ws);
    }
  });

  ws.send('something');

}

module.exports = {
  establishConnectionWithWebSocket,
};
