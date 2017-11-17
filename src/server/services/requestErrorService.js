const responseService = require('./responseService');
const logger = require('../utils/logger').logger;

function handleError(type, body, error) {
  const errorTypes = {
    PostNewFile: responseService.fileDownloadFailedResponse,
    GetFiles: responseService.commandErrorResponse,
    GetPlaylist: responseService.playerPlayListResponse,
    SetDefaultContent: responseService.commandErrorResponse,
    PlayDefault: responseService.commandErrorResponse,
    UnknownMessage: responseService.unknownMessage,
  };

  if (type === 'GetPlaylist') {
    return body.webSocket.send(errorTypes[type](body.commandId, '[]'));
  } else if (errorTypes[type]) {
    return body.webSocket.send(errorTypes[type](body, error.message));
  }

  logger.error(error);
}

module.exports = {
  handleError,
};
