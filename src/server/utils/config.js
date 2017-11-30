const BASE_URL = 'b.pixelart.ge:5300';
const REST_API_URL = `http://${BASE_URL}/api/1/player/register/`;
const WS_API_URL = `ws://${BASE_URL}/api/1/player/`;
const LOCAL = '/storage/sd/'; // '/Users/bartosz/Repositories/pixelart-player-bs';
const DATABASE_ADDRESS = `${LOCAL}`;
const TMP_DIRECTORY = '';// '/tmp/';
const CONTENT_ADDRESS = `${LOCAL}/content/`;
const PLAYLIST_ADDRESS = `${CONTENT_ADDRESS}/playlist.json`;

module.exports = {
  REST_API_URL,
  WS_API_URL,
  DATABASE_ADDRESS,
  PLAYLIST_ADDRESS,
  CONTENT_ADDRESS,
};
