const responseService = require('./responseService');

function handleError(type, body, error) {
  const errorTypes = {
    PostNewFile: responseService.fileDownloadFailedResponse,
    GetFiles: responseService.commandErrorResponse,
    GetPlaylist: responseService.playerPlayListResponse,
    SetDefaultContent: responseService.commandErrorResponse,
    PlayDefault: responseService.commandErrorResponse,
    UnknownMessage: responseService.unknownMessage,
    UpdatePassword: responseService.commandErrorResponse,
    SetOrientation: responseService.commandErrorResponse,
    UpdatePlayerName: responseService.commandErrorResponse,
    Unregister: responseService.commandErrorResponse,
    UpdateLogServerURI: responseService.commandErrorResponse,
    UpdateServerURI: responseService.commandErrorResponse,
  };

  console.log(error);

  if (type === 'GetPlaylist') {
    return body.webSocket.send(errorTypes[type](body.commandId, '[]'));
  } else if (errorTypes[type]) {
    return body.webSocket.send(errorTypes[type](body, error.message));
  }
  return body.webSocket.send(errorTypes.UnknownMessage(body, error.message));
}

module.exports = {
  handleError,
};