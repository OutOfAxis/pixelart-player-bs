const fileHandler = require('../utils/fileHandler');
const responseService = require('./responseService');

function handleMessage(content, webSocket) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  message[messageName].webSocket = webSocket;

  processMessageRequest(messageName, message[messageName], webSocket);
}

function processMessageRequest(type, body) {
  const types = {
    PostNewFile: postNewFile,
    GetFiles: getFiles,
    DeleteFile: deleteFile,
    GetFile: selectGetFile,
    PostNewPlaylist: postNewPlaylist,
    GetPlaylist: getPlaylist,
    setDefaultContent: setDefaultContent,
    playDefault: playDefault,
    setRecoverContent: setRecoverContent,
  };

  types[type](body);
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

function getFiles({ commandId, webSocket }) {

}

function deleteFile({ commandId, fileId, webSocket }) {

}

function getFileById({ commandId, fileId, uploadPath, webSocket }) {
}

function getFileByPath({ commandId, localPath, uploadPath, webSocket }) {

}

function postNewPlaylist({ commandId, fileId, downloadPath, playList, webSocket }) {
}

function getPlaylist({ commandId, webSocket }) {

  webSocket.send(responseService.playerPlayListResponse(commandId, '[]'));
}

function setDefaultContent({ commandId, uri, webSocket }) {

}

function playDefault({ commandId, webSocket }) {

}

function setRecoverContent({ commandId, uri, webSocket }) {

}

module.exports = {
  handleMessage,
};
