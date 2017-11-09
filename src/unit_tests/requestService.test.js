const chai = require('chai');
const sinon = require('sinon');

const requestService = require('../server/services/requestService');
const responseService = require('../server/services/responseService');

describe('requestService tests', () => {

  describe('processMessageRequest', () => {
    let message;
    let webSocket;
    beforeEach(() => {
      message = JSON.stringify({
        GetPlaylist: {
          commandId:"8cc65502-6dc1-4762-bcf1-ca459a503512"
        }
      });
      webSocket.send = sinon.spy();
    });

    it('For GetPlaylist message should call getPlaylist and send playerPlayListResponse ', () => {
      
    });
  });

