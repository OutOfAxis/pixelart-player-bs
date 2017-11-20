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
    GetFiles: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
    },
  });

  const error = new Error('error');
  const response = responseService.commandErrorResponse({ commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512' }, error.message);

  describe('processMessageRequest - GetFiles fail', () => {
    it('For GetFiles message call getResourcesDetails from fileHandler, expect reject on error and send commandError response', () => {
      const fileHandlerMock = {
        getResourcesDetails: () => Promise.reject(error),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

});
