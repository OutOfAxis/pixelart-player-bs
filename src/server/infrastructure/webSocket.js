const communication = require('../utils/config');
const databaseService = require('../services/databaseService');
const messagingService = require('../services/requestService');
const encryption = require('../utils/encryption');

const WebSocket = require('ws');

async function establishConnectionWithWebSocket() {
  let configuration = await databaseService.getConfiguration();
  const url = await communication.getWebSocketAddress(configuration.serverUri, configuration.id);
  const authorizationToken = `${configuration.id}:${configuration.password}`;
  let ws = new WebSocket(url, {
    perMessageDeflate: false,
    headers: {
      Authorization: `Basic ${encryption.encode(authorizationToken)}`,
    },
  });
  let pingerIntervalId = null;

  ws.on('open', function open() {
    console.log('Connection to WebSocket has been established.');

    // pingerIntervalId = setInterval(function timeout() {
    //   ws.ping(function(error) {
    //     if (error) {
    //       console.error(`Sending ping failed: ${ error }`);
    //       ws.terminate();
    //     }
    //   });
    // }, 5000);
  });

  ws.on('connection', function open() {
    console.log('connected');
  });

  ws.on('message', function incoming(data) {
    if (data) {
      messagingService.handleMessage(data, ws);
    }
  });

  ws.on('ping', function ping() {
    // console.log('Ping received');
  });

  ws.on('pong', function pong() {
    // console.log('Pong received');
  });

  ws.on('error', function error(err) {
    console.error(`WebSocket communication error: ${ err }`);
    ws.terminate();
  });

  ws.on('unexpected-response', function unexpectedResponse(req, res) {
    console.error(`Unexpected response from server: ${ res }`);
    ws.terminate();
  });

  ws.on('close', function close(code, reason) {
    console.log(`Disconnected (${ reason }), trying establish new connection`);
    clearInterval(pingerIntervalId);
    configuration = null;
    ws = null;
    setTimeout(establishConnectionWithWebSocket, 1000);
  });


}

module.exports = {
  establishConnectionWithWebSocket,
};