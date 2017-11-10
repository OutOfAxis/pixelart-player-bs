function playerPlayListResponse(commandId, playlist) {
  return JSON.stringify({
    PlayerPlaylist: {
      commandId,
      playlist,
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
  unknownMessage,
};