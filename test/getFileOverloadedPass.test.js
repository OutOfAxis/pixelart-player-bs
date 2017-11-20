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
    GetFile: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      localPath: 'smutnazaba.jpg',
      uploadPath: 'google.com/here',
    },
  });

  const response = responseService.unknownMessage('getFileByPath', '8cc65502-6dc1-4762-bcf1-ca459a503512');

  describe('processMessageRequest - GetFile overloaded unimplemented', () => {
    it('For unhandled GetFile expect unknown message response', () => {
      const fileHandlerMock = {
        deleteFile: () => Promise.resolve(),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
  });

});
