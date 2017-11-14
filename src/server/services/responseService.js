function fileDownloadedResponse(commandId, fileId, transferredSize) {
  return JSON.stringify({
    FileDownloaded: {
      commandId,
      fileId,
      transferredSize,
    },
  });
}

function playerPlayListResponse(commandId, playlist) {
  return JSON.stringify({
    PlayerPlaylist: {
      commandId,
      playlist,
    },
  });
}

function commandAckResponse(commandId) {
  return JSON.stringify({
    CommandAck: {
      commandId,
    },
  });
}

function getFilesResponse(commandId, files) {
  // Changes needed
  return JSON.stringify({
    PlayerFiles: {
      commandId,
      files,
    },
  });
}

function fileDownloadFiledResponse(commandId, fileId,reason) {
  return JSON.stringify({
    FileDownloadFailed: {
      commandId,
      fileId,
      reason,
    },
  });
}

function commandErrorResponse(commandId, reason) {
  return JSON.stringify({
    CommandError: {
      commandId,
      reason,
    },
  });
}

function unknownMessage(type, commandId) {
  return JSON.stringify({
    UnknownMessageType: {
      commandId,
      type,
    },
  });
}

module.exports = {
  fileDownloadedResponse,
  playerPlayListResponse,
  commandAckResponse,
  getFilesResponse,
  fileDownloadFiledResponse,
  commandErrorResponse,
  unknownMessage,
};