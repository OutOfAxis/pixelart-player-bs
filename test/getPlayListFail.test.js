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

  describe('processMessageRequest - GetPlayList fail', () => {
    const error = new Error('error');
    const message = JSON.stringify({
      GetPlaylist: {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      },
    });

    const response = responseService.playerPlayListResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', '[]');

    it('For GetPlaylist message should call getPlaylist and send playerPlayListResponse if file does not exist', () => {
      const fileHandlerMock = {
        createNewFile: () => Promise.resolve(),
        getFileContent: () => Promise.reject(error),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

});
