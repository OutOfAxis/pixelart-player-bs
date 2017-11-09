const fileHandler = require('../utils/fileHandler');

function handleMessage(content, webSocket) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  message[messageName].webSocket = webSocket;
  processMessageRequest(messageName, message[messageName], webSocket);
}

function processMessageRequest(type, body) {
  const types = {
    'PostNewFile': () => {
      postNewFile(body);
    },
    'GetFiles': () => {
      getFiles(body);
    },
    'DeleteFile': () => {
      deleteFile(body);
    },
    'GetFile': () => {
      selectGetFile(body);
    },
    'PostNewPlaylist': () => {
      postNewPlaylist(body);
    },
    'GetPlaylist': () => {
      getPlaylist(body);
    },
    'setDefaultContent': () => {
      setDefaultContent(body);
    },
    'playDefault': () => {
      playDefault(body);
    },
    'setRecoverContent': () => {
      setRecoverContent(body);
    },
  };

  types[type]();
}

function postNewFile({ commandId, fileId, downloadPath, sourcePath, fileSize, webSocket }) {
  fileHandler.downloadFile(fileId, downloadPath, sourcePath);
}

function getFiles({ commandId, webSocket }) {
  return console.log('Snork, snork. MAGIC.');

}

function deleteFile({ commandId, fileId, webSocket }) {
  return console.log('Snork, snork. MAGIC.');

}

function selectGetFile(body) {
  if (body.fielId) {
    getFileById(body);
  } else {
    getFileByPath(body);
  }
}

function getFileById({ commandId, fileId, uploadPath, webSocket }) {
}

function getFileByPath({ commandId, localPath, uploadPath, webSocket }) {

}

function postNewPlaylist({ commandId, fileId, downloadPath, playList, webSocket }) {
  return console.log('Snork, snork. MAGIC.');
}

function getPlaylist({ commandId, webSocket }) {
  const response = {
    'PlayerPlaylist': {
      'commandId': commandId,
      'playlist': '[]',
    },
  };

  webSocket.send(JSON.stringify(response));
  console.log(response);
  console.log(JSON.stringify(response));
}

function setDefaultContent({ commandId, uri, webSocket }) {
  return console.log('Snork, snork. MAGIC.');

}

function playDefault({ commandId, webSocket }) {
  return console.log('Snork, snork. MAGIC.');

}

function setRecoverContent({ commandId, uri, webSocket }) {
  return console.log('Snork, snork. MAGIC.');

}

module.exports = {
  handleMessage,
};
