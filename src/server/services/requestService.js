const fileHandler = require('../utils/fileHandler');
const responseService = require('./responseService');
const config = require('../utils/config');

function handleMessage(content, webSocket) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  message[messageName].webSocket = webSocket;

  return processMessageRequest(messageName, message[messageName], webSocket);
}

function processMessageRequest(type, body) {
  const types = {
    PostNewFile: postNewFile,
    GetFiles: getFiles,
    DeleteFile: deleteFile,
    GetFile: selectGetFile,
    PostNewPlaylist: postNewPlaylist,
    GetPlaylist: getPlaylist,
    SetDefaultContent: setDefaultContent,
    PlayDefault: playDefault,
    SetRecoverContent: setRecoverContent,
  };

  if (!types[type]) {
    return unknownMessage(type, body);
  }

  return types[type](body);
}

function selectGetFile(body) {
  if (body.fielId) {
    getFileById(body);
  } else {
    getFileByPath(body);
  }
}

function postNewFile({ commandId, fileId, downloadPath, sourcePath, fileSize, webSocket }) {
  fileHandler.downloadFile(fileId, downloadPath, sourcePath);
}

function getFiles({ commandId, webSocket }) {}

function deleteFile({ commandId, fileId, webSocket }) {}

function getFileById({ commandId, fileId, uploadPath, webSocket }) {}

function getFileByPath({ commandId, localPath, uploadPath, webSocket }) {}

async function postNewPlaylist({ commandId, playList, webSocket }) {
  try {
    await fileHandler.createNewFile(config.PLAYLIST_ADDRESS, playList);
  } catch (error) {
    console.log(error);
  }
  webSocket.send(responseService.commandAckResponse(commandId));
}

async function getPlaylist({ commandId, webSocket }) {
  let playList = '[]';
  try {
    playList = await fileHandler.getFileContent(config.PLAYLIST_ADDRESS);
  } catch (error) {
    if (error === 'ENOENT') {
      playList = '[]';
    }
  }
  webSocket.send(responseService.playerPlayListResponse(commandId, playList));
}

function setDefaultContent({ commandId, uri, webSocket }) {}

function playDefault({ commandId, webSocket }) {}

function setRecoverContent({ commandId, uri, webSocket }) {}

function unknownMessage(type, { commandId, webSocket }) {
  webSocket.send(responseService.unknownMessage(type, commandId));
}

module.exports = {
  handleMessage,
};
