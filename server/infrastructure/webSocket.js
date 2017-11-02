const databaseService = require('../services/databaseService');
const encryption = require('../utils/encryption');
const communication = require('../utils/communication');

const WebSocket = require('ws');

function establishConnectionWithWebSocket() {
  return databaseService.getConfiguration()
    .then((config) => {
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
    });
}

module.exports = {
  establishConnectionWithWebSocket,
};
