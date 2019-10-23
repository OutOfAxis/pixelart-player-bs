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
  let pingCheckerIntervalId = null;
  let lastPing = null;

  ws.on('open', function open() {
    console.log('WS: Connection to server has been established.');

    // pingerIntervalId = setInterval(function timeout() {
    //   ws.ping(function(error) {
    //     if (error) {
    //       console.error(`Sending ping failed: ${ error }`);
    //       ws.terminate();
    //     }
    //   });
    // }, 5000);

    pingCheckerIntervalId = setInterval(function() {
      console.log(`WS: lastPing=${ lastPing } readyState=${ ws.readyState }`);
      if (lastPing && lastPing < new Date().valueOf() - 15000) {
        console.error(`WS: No ping received in the last 15sec, closing connection`);
        ws.close();
      }
    }, 5000);
  });

  ws.on('connection', function open() {
    console.log('WS: connected');
  });

  ws.on('message', function incoming(data) {
    console.log(`WS: Message received: ${ JSON.stringify(data) }`);
    lastPing = new Date().valueOf();
    if (data) {
      messagingService.handleMessage(data, ws);
    }
  });

  ws.on('ping', function ping() {
    console.log('WS: Ping received');
    lastPing = new Date().valueOf();
  });

  ws.on('pong', function pong() {
    console.log('WS: Pong received');
  });

  ws.on('error', function error(err) {
    console.error(`WS: Communication error: ${ err }`);
    // ws.terminate();
  });

  ws.on('unexpected-response', function unexpectedResponse(req, res) {
    console.error(`WS: Unexpected response from server: ${ res }`);
    console.dir(req);
    console.dir(res);
    // ws.terminate();
  });

  ws.on('close', function close(code, reason) {
    console.log(`WS: Disconnected (${ code }): ${ reason }, trying establish new connection`);
    clearInterval(pingCheckerIntervalId);
    configuration = null;
    // ws = null;
    setTimeout(establishConnectionWithWebSocket, 31000);
  });


}

module.exports = {
  establishConnectionWithWebSocket,
};
