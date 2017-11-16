const responseService = require('./responseService');

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

  console.log(error);
}

module.exports = {
  handleError,
};
