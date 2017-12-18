function fileDownloadedResponse(commandId, fileId, transferredSize) {
  return JSON.stringify({
    FileDownloaded: {
      commandId,
      fileId,
      transferredSize,
    },
  });
}

function fileUploadedResponse(commandId, fileId, uploadPath) {
  return JSON.stringify({
    FileUploaded: {
      commandId,
      fileId,
      uploadPath,
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
  return JSON.stringify({
    PlayerFiles: {
      commandId,
      files,
    },
  });
}

function fileDownloadFailedResponse({ commandId, fileId }, reason) {
  return JSON.stringify({
    FileDownloadFailed: {
      commandId,
      fileId,
      reason,
    },
  });
}

function playerNameUpdatedResponse(commandId, name) {
  return JSON.stringify({
    PlayerNameUpdated: {
      commandId,
      name,
    },
  });
}

function commandErrorResponse({ commandId }, reason) {
  return JSON.stringify({
    CommandError: {
      commandId,
      reason,
    },
  });
}

function unknownMessage({ type, commandId }) {
  return JSON.stringify({
    UnknownMessageType: {
      commandId,
      type,
    },
  });
}

module.exports = {
  fileDownloadedResponse,
  fileUploadedResponse,
  playerPlayListResponse,
  commandAckResponse,
  getFilesResponse,
  fileDownloadFailedResponse,
  playerNameUpdatedResponse,
  commandErrorResponse,
  unknownMessage,
};
