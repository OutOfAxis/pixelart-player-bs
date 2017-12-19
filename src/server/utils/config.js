const databaseService = require('../services/databaseService');

const LOCAL = '/Users/bartosz/Repositories/pixelart-player-bs'; // '/storage/sd';
const DATABASE_ADDRESS = `${LOCAL}`;
const TMP_DIRECTORY = '/Users/bartosz/Repositories/pixelart-player-bs';
const CONTENT_ADDRESS = `${LOCAL}/content/`;
const PLAYLIST_ADDRESS = `${CONTENT_ADDRESS}/playlist.json`;

function getWebSocketAddress(address, id) {
  return `ws://${address}/api/1/player/${id}/ws`;
}

async function getAPIAddress() {
  const configuration = await databaseService.getConfiguration();

  return `http://${configuration.serverUri}/api/1/player/register/`;
}

module.exports = {
  LOCAL,
  DATABASE_ADDRESS,
  PLAYLIST_ADDRESS,
  CONTENT_ADDRESS,
  getWebSocketAddress,
  getAPIAddress,
};
