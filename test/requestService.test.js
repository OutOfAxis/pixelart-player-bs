/* eslint-disable promise/prefer-await-to-then */
require('babel-polyfill');

const mockery = require('mockery');
const chai = require('chai');

const responseService = require('../src/server/services/responseService');

describe('requestService tests', () => {

  describe('processMessageRequest - PostNewFile fail', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - GetPlayList pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
      GetPlaylist: {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      },
    });

    const response = responseService.playerPlayListResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', '[]');

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
  });

  describe('processMessageRequest - GetPlayList fail', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - Unknown message pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
      'Revolve.pro': {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
      },
    });

    const response = responseService.unknownMessage('Revolve.pro', '8cc65502-6dc1-4762-bcf1-ca459a503512');
    it('For unknown message should handle it and send unknown message response with commandId ', () => {
      const requestService = require('../src/server/services/requestService');

      requestService.handleMessage(message, webSocket);
      chai.assert.equal(latestArgs, response);
    });
  });

  describe('processMessageRequest - PostNewPlayList pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
      'PostNewPlaylist': {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
        fileId: '',
        downloadPath: '',
        playList: '[]',
      },
    });

    const response = responseService.commandAckResponse('8cc65502-6dc1-4762-bcf1-ca459a503512');

    it('For PostNewPlaylist message call postNewPlaylist, fileHandler, get promise and send CommandAck response', () => {
      const fileHandlerMock = {
        createNewFile: () => Promise.resolve(),
      };
      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

  describe('processMessageRequest - PostNewFile pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - SetDefaultContent pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - SetDefaultContent fail', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
    const error = new Error('error');
    const message = JSON.stringify({
      SetDefaultContent: {
        commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512',
        uri: 'http://some.url/some/pic',
      },
    });

    const response = responseService.commandErrorResponse({ commandId: '8cc65502-6dc1-4762-bcf1-ca459a503512' }, error.message);

    it('For SetDefaultContent call insertDefaultContent in db service,reject on error and send commandError response', () => {
      const databaseServiceMock = {
        insertDefaultContent: () => Promise.reject(error),
      };

      mockery.registerMock('./databaseService', databaseServiceMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

  describe('processMessageRequest - GetFiles pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

    const response = responseService.getFilesResponse('8cc65502-6dc1-4762-bcf1-ca459a503512', '[]');

    it('For GetFiles message call getResourcesDetails from fileHandler, expect resolve and send getFilesResponse', () => {
      const fileHandlerMock = {
        getResourcesDetails: () => Promise.resolve('[]'),
      };

      mockery.registerMock('../utils/fileHandler', fileHandlerMock);

      const requestService = require('../src/server/services/requestService');

      return requestService.handleMessage(message, webSocket).then(() => {
        chai.assert.equal(latestArgs, response);
      });
    });
  });

  describe('processMessageRequest - GetFiles fail', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - DeleteFile pass', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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

  describe('processMessageRequest - GetFile unimplemented', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
        fileId: 'smutnazaba.jpg',
        uploadPath: 'google.com/here',
      },
    });

    const response = responseService.unknownMessage('getFileById', '8cc65502-6dc1-4762-bcf1-ca459a503512');

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

  describe('processMessageRequest - GetFile overloaded unimplemented', () => {
    let webSocket;
    let latestArgs;

    afterEach(() => {
      mockery.disable();
      mockery.deregisterAll();
    });

    beforeEach(() => {
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
