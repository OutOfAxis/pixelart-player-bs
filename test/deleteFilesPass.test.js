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
    DeleteFile: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      fileId: 'pics/smutnazaba.jpg',
    },
  });

  const response = responseService.commandAckResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', 'error');

  describe('processMessageRequest - DeleteFile pass', () => {
    it('For DeleteFile message call deleteFile from fileHandler, expect promise and send commandAck response', () => {
      const fileHandlerMock = {
        deleteFile: () => Promise.resolve(),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });
});
