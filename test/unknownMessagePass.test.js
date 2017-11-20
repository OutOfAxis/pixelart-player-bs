/* eslint-disable promise/prefer-await-to-then */
require('babel-polyfill');

const mockery = require('mockery');
const chai = require('chai');

const responseService = require('../src/server/services/responseService');

describe('requestService tests', () => {
  let webSocket;
  let latestArgs;

  after(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true,
    });

    webSocket = {};

    const mySpy = (args) => {
      latestArgs = args;
    };

    webSocket.send = mySpy;
    latestArgs = null;
  });

  const message = JSON.stringify({
    'Revolve.pro': {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
    },
  });

  const response = responseService.unknownMessage('Revolve.pro', '8cc65502-6dc1-4762-bcf1-ca459a503512');

  describe('processMessageRequest - Unknown message pass', () => {
    it('For unknown message should handle it and send unknown message response with commandId ', () => {
      const requestService = require('../src/server/services/requestService');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
  });

});
