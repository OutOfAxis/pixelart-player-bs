const communication = require('../utils/config');
const databaseService = require('../services/databaseService');
const messagingService = require('../services/requestService');
const encryption = require('../utils/encryption');
const logger = require('../utils/logger').logger;

const WebSocket = require('ws');

async function establishConnectionWithWebSocket() {
  const configuration = await databaseService.getConfiguration();
  const url = `${communication.WS_API_URL}${configuration.id}/ws`;
  const authorizationToken = `${configuration.id}:${configuration.password}`;
  const ws = new WebSocket(url, {
    perMessageDeflate: false,
    headers: {
      Authorization: `Basic ${encryption.encode(authorizationToken)}`,
    },
  });

  ws.on('open', function open() {
    logger.info('Connection to WebSocket has been established.');
  });

  ws.on('message', function incoming(data) {
    if (data) {
      messagingService.handleMessage(data, ws);
    }
  });

  ws.on('close', function close() {
    logger.info('Disconnected, trying establish new connection');
    establishConnectionWithWebSocket();
  });

  setTimeout(function timeout() {
    ws.send();
  }, 5000);
}

module.exports = {
  establishConnectionWithWebSocket,
};
