require('babel-polyfill');

const chai = require('chai');

const requestService = require('../src/server/services/requestService');
const responseService = require('../src/server/services/responseService');

describe('requestService tests', () => {

  describe('processMessageRequest', () => {
    let message;
    let webSocket;
    let latestArgs;
    beforeEach(() => {
      webSocket = {};
      const mySpy = (...args) => {
        latestArgs = args;
      }
      webSocket.send = mySpy;
      latestArgs = null;
    });

    it('For GetPlaylist message should call getPlaylist and send playerPlayListResponse ', () => {
      message = JSON.stringify({
        GetPlaylist: {
          commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
        },
      });
      const response = responseService.playerPlayListResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', '[]');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
    it('For unknown message should handle it and send unknown message response with commandId ', () => {
      message = JSON.stringify({
        'Revolve.pro': {
          commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
        },
      });
      const response = responseService.unknownMessage('Revolve.pro', '8cc65502-6dc1-4762-bcf1-ca459a503512');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
  });
});
