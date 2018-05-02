const path = require('path');
const url = require('url');
const fileHandler = require('../utils/fileHandler');
const responseService = require('./responseService');
const databaseService = require('./databaseService');
const errorService = require('./requestErrorService');
const config = require('../utils/config');

const bsMessage = new BSMessagePort();

function handleMessage(content, webSocket) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  message[messageName].webSocket = webSocket;
  console.log(messageName);

  return processMessageRequest(messageName, message[messageName], webSocket);
}

async function processMessageRequest(type, body) {
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
    UpdatePassword: updatePassword,
    SetOrientation: updateOrientation,
    UpdateName: updatePlayerName,
    Unregister: unregister,
    UpdateLogServerUri: updateLogServerURI,
    UpdateServerUri: updateServerURI,
    Reboot: reboot,
  };

  if (!types[type]) {
    return unknownMessage(type, body);
  }
  try {
    return await types[type](body);
  } catch (error) {
    return errorService.handleError(type, body, error);
  }
}

function selectGetFile(body) {
  if (body.fileId) {
    getFileById(body);
  } else {
    getFileByPath(body);
  }
}

async function postNewFile({ commandId, fileId, sourcePath, webSocket }) {
  await fileHandler.downloadFile(fileId, sourcePath);
  const transferredFileStats = await fileHandler.getFileDetails(config.CONTENT_ADDRESS + fileId);

  webSocket.send(responseService.fileDownloadedResponse(commandId, fileId, transferredFileStats.transferredSize), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function getFiles({ commandId, webSocket }) {
  const content = await fileHandler.getResourcesDetails();

  webSocket.send(responseService.getFilesResponse(commandId, content), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function deleteFile({ commandId, fileId, webSocket }) {
  await fileHandler.deleteFile(fileId.charAt(0) === '/' ? fileId : path.join(config.CONTENT_ADDRESS, fileId));

  webSocket.send(responseService.commandAckResponse(commandId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function getFileById({ commandId, fileId, uploadPath, webSocket }) {
  unknownMessage('getFileById', { commandId, webSocket }, fileId, uploadPath);
}

function getFileByPath({ commandId, localPath, uploadPath, webSocket }) {
  unknownMessage('getFileByPath', { commandId, webSocket }, localPath, uploadPath);
}

async function postNewPlaylist({ commandId, playList, webSocket }) {
  await fileHandler.createNewFile(config.PLAYLIST_ADDRESS, playList);
  webSocket.send(responseService.commandAckResponse(commandId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function getPlaylist({ commandId, webSocket }) {
  const playList = await fileHandler.getFileContent(config.PLAYLIST_ADDRESS);

  webSocket.send(responseService.playerPlayListResponse(commandId, playList), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function setDefaultContent({ commandId, uri, webSocket }) {
  uri = url.parse(uri).protocol ? uri : config.DEFAULT_CONTENT;
  await databaseService.updateConfiguration(`defaultContent`, uri);

  webSocket.send(responseService.commandAckResponse(commandId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

async function playDefault({ commandId, webSocket }) {
  const configuration = await databaseService.getConfiguration();
  sendBrightSignMessage('loadurl', { url: configuration.defaultContent });

  webSocket.send(responseService.commandAckResponse(commandId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function setRecoverContent({ commandId, uri, webSocket }) {
  webSocket.send(responseService.unknownMessage(uri, commandId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}

function unknownMessage(type, { commandId, webSocket }) {
  webSocket.send(responseService.unknownMessage(type, commandId));
}

async function updatePassword({ newPassword, commandId, webSocket }) {
  await databaseService.updateConfiguration('password', newPassword);

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function updateOrientation({ orientation, commandId, webSocket }) {
  await databaseService.updateConfiguration('orientation', orientation);

  sendBrightSignMessage('orientationChanged', { orientation });

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function updatePlayerName({ newName, commandId, webSocket }) {
  await databaseService.updateConfiguration('name', newName);

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function unregister({ commandId, webSocket }) {
  await databaseService.updateConfiguration('registered', false);

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function updateLogServerURI({ Uri, commandId, webSocket }) {
  await databaseService.updateConfiguration('logServerUri', Uri);

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function updateServerURI({ Uri, commandId, webSocket }) {
  await databaseService.updateConfiguration('serverUri', Uri);

  webSocket.send(responseService.commandAckResponse(commandId));
}

function reboot({ commandId, webSocket }) {
  sendBrightSignMessage('reboot');

  webSocket.send(responseService.commandAckResponse(commandId));
}

function sendBrightSignMessage(msgtype, payload = {}) {
  const message = Object.assign({}, payload, { msgtype });

  console.log(`Sending message to BrightScript: ${ JSON.stringify(message) }`);
  if (!bsMessage.PostBSMessage(message)) {
    console.error('PostBSMessage() failed');
  }
}

module.exports = {
  handleMessage,
};
