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

  const fileId = 'smutnazaba.jpg';
  const message = JSON.stringify({
    PostNewFile: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      fileId: fileId,
      sourcePath: 'http://some.url/some/pic',
    },
  });

  const error = new Error('error');
  const response = responseService.fileDownloadFailedResponse({ commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512', fileId }, error.message);

  describe('processMessageRequest - PostNewFile fail', () => {
    it('For PostNewFile fail message, should get fileDownloadFailedResponse', () => {
      const fileHandlerMock = {
        downloadFile: () => Promise.reject(error),
        getFileDetails: () => Promise.reject(error),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

});
