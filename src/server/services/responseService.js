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

function unknownMessage(type, commandId) {
  return JSON.stringify({
    UnknownMessageType: {
      commandId,
      type,
    },
  });
}

module.exports = {
  playerPlayListResponse,
  commandAckResponse,
  unknownMessage,
};