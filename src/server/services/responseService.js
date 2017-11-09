function playerPlayListResponse(commandId, playlist) {
  return JSON.stringify({
    PlayerPlaylist: {
      'commandId': commandId,
      'playlist': playlist,
    },
  });
}

module.exports = {
  playerPlayListResponse,
};