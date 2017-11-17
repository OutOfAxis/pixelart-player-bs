const fileHandler = require('../utils/fileHandler');
const responseService = require('./responseService');
const databaseService = require('./databaseService');
const errorService = require('./requestErrorService');
const config = require('../utils/config');
const logger = require('../utils/logger').logger;

function handleMessage(content, webSocket) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  message[messageName].webSocket = webSocket;
  logger.info(messageName);

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

  webSocket.send(responseService.fileDownloadedResponse(commandId, fileId, transferredFileStats.transferredSize));
}

async function getFiles({ commandId, webSocket }) {
  const content = await fileHandler.getResourcesDetails();

  webSocket.send(responseService.getFilesResponse(commandId, content));
}

async function deleteFile({ commandId, fileId, webSocket }) {
  await fileHandler.deleteFile(fileId);

  webSocket.send(responseService.commandAckResponse(commandId));
}

function getFileById({ commandId, fileId, uploadPath, webSocket }) {
  unknownMessage('getFileById', { commandId, webSocket }, fileId, uploadPath);
}

function getFileByPath({ commandId, localPath, uploadPath, webSocket }) {
  unknownMessage('getFileByPath', { commandId, webSocket }, localPath, uploadPath);
}

async function postNewPlaylist({ commandId, playList, webSocket }) {
  await fileHandler.createNewFile(config.PLAYLIST_ADDRESS, playList);

  webSocket.send(responseService.commandAckResponse(commandId));
}

async function getPlaylist({ commandId, webSocket }) {
  let playList = '[]';
  playList = await fileHandler.getFileContent(config.PLAYLIST_ADDRESS);

  webSocket.send(responseService.playerPlayListResponse(commandId, playList));
}

async function setDefaultContent({ commandId, uri, webSocket }) {
  await databaseService.insertDefaultContent(uri);

  webSocket.send(responseService.commandAckResponse(commandId));
}

function playDefault({ commandId, webSocket }) {
  logger.info('Here we play default content');

  webSocket.send(responseService.commandAckResponse(commandId));
}

function setRecoverContent({ commandId, uri, webSocket }) {
  webSocket.send(responseService.unknownMessage(uri, commandId));
}

function unknownMessage(type, { commandId, webSocket }) {
  webSocket.send(responseService.unknownMessage(type, commandId));
}

module.exports = {
  handleMessage,
};
