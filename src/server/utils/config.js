const LOCAL = '/storage/sd';
const DATABASE_ADDRESS = `${LOCAL}`;
const TMP_DIRECTORY = '/Users/bartosz/Repositories/pixelart-player-bs';
const CONTENT_ADDRESS = `${LOCAL}/content/`;
const PLAYLIST_ADDRESS = `${CONTENT_ADDRESS}/playlist.json`;
const DEFAULT_CONTENT = 'file:///SD:/content/index.html';

function getWebSocketAddress(address, id) {
  return `ws://${address}/api/1/player/${id}/ws`;
}

function getAPIAddress(serverUri) {
  return `http://${serverUri}/api/1/player/register/`;
}

module.exports = {
  LOCAL,
  DATABASE_ADDRESS,
  PLAYLIST_ADDRESS,
  CONTENT_ADDRESS,
  DEFAULT_CONTENT,
  getWebSocketAddress,
  getAPIAddress,
};
