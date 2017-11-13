/* eslint-disable promise/prefer-await-to-then */
require('babel-polyfill');

const mockery = require('mockery');
const chai = require('chai');

const responseService = require('../src/server/services/responseService');

describe('requestService tests', () => {

  describe('processMessageRequest', () => {
    let message;
    let webSocket;
    let latestArgs;

    before(() => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
      });
    });

    after(() => {
      mockery.disable();
    });

    beforeEach(() => {
      webSocket = {};
      const mySpy = (args) => {
        latestArgs = args;
      };
      webSocket.send = mySpy;
      latestArgs = null;
    });

    message = JSON.stringify({
      GetPlaylist: {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      },
    });

    let response = responseService.playerPlayListResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', '[]');

    it('For GetPlaylist message should call getPlaylist and send playerPlayListResponse if file exists', () => {
      const fileHandlerMock = {
        createNewFile: () => Promise.resolve(),
        getFileContent: () => Promise.resolve('[]'),
      };
      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
    it('For GetPlaylist message should call getPlaylist and send playerPlayListResponse if file does not exist', () => {
      const fileHandlerMock = {
        createNewFile: () => Promise.resolve(),
        getFileContent: () => Promise.reject('ENOENT'),
      };
      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
    it('For unknown message should handle it and send unknown message response with commandId ', () => {
      const requestService = require('../src/server/services/requestService');

      message = JSON.stringify({
        'Revolve.pro': {
          commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
        },
      });
      response = responseService.unknownMessage('Revolve.pro', '8cc65502-6dc1-4762-bcf1-ca459a503512');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
    it('For PostNewPlaylist message call postNewPlaylist, fileHandler, get promise and send CommandAck response', () => {
      const fileHandlerMock = {
        createNewFile: () => Promise.resolve(),
      };
      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      message = JSON.stringify({
        'PostNewPlaylist': {
          commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
          fileId: '',
          downloadPath: '',
          playList: '[]',
        },
      });
      response = responseService.commandAckResponse('8cc65502-6dc1-4762-bcf1-ca459a503512');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });
});