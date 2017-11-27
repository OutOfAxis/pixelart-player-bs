const BASE_URL = 'b.pixelart.ge:5300';
const REST_API_URL = `http://${BASE_URL}/api/1/player/register/`;
const WS_API_URL = `ws://${BASE_URL}/api/1/player/`;
const LOCAL = '/Users/bartosz/Repositories/pixelart-player-bs';
const DATABASE_ADDRESS = `${LOCAL}`;
const PLAYLIST_ADDRESS = `${LOCAL}/tmp/content/playlist.json`;
const CONTENT_ADDRESS = `${LOCAL}/tmp/content/`;

module.exports = {
  REST_API_URL,
  WS_API_URL,
  DATABASE_ADDRESS,
  PLAYLIST_ADDRESS,
  CONTENT_ADDRESS,
};
