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
    PostNewFile: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      fileId: 'smutnazaba.jpg',
      downloadPath: 'http://some.url/some/pic',
    },
  });

  const response = responseService.fileDownloadedResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', 'smutnazaba.jpg', '7654');

  describe('processMessageRequest - PostNewFile pass', () => {
    it('For PostNewFile message call postNewFile, fileHandler, get promise and send fileDownloadedResponse', () => {
      const fileHandlerMock = {
        downloadFile: () => Promise.resolve(),
        getFileDetails: () => Promise.resolve({ fileId: 'smutnazaba.jpg',
          localPath: 'path/smutnazaba.jpg',
          transferredSize: '7654',
          mimeType: '.jpg',
        }),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

});
