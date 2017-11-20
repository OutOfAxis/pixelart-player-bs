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
    SetDefaultContent: {
      commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      uri: 'http://some.url/some/pic',
    },
  });

  const response = responseService.commandAckResponse('8cc65502-6dc1-4762-bcf1-ca459a503512');

  describe('processMessageRequest - SetDefaultContent pass', () => {
    it('For SetDefaultContent call insertDefaultContent in db service, resolve and send commandAck response', () => {
      const databaseServiceMock = {
        insertDefaultContent: () => Promise.resolve(),
      };

      mockery.registerMock('./databaseService', databaseServiceMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

});
