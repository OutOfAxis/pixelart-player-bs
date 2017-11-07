

function handleMessage(content) {
  const message = JSON.parse(content);
  const messageName = Object.getOwnPropertyNames(message)[0];
  // const props = body
  processMessageRequest(messageName, )
}

function processMessageRequest(type, body) {
  const types = {
    'PostNewFile': () => {
      postNewFile(...body);
    },
    'GetFiles': () => {
      getFiles(...body);
    },
    'DeleteFile': () => {
      deleteFile(...body);
    },
    'GetFile': () => {
      getFile(...body);
    },
    'PostNewPlaylist': () => {
      postNewPlaylist(...body);
    },
    'GetPlaylist': () => {
      getPlaylist(...body);
    },
    'setDefaultContent': () => {
      setDefaultContent(...body);
    },
    'playDefault': () => {
      playDefault(...body);
    },
    'setRecoverContent': () => {
      setRecoverContent(...body);
    },
  };

  types[type]();
}

function postNewFile(commandId, fileId, downloadPath, sourcePath, fileSize) {
  return console.log('Snork, snork. MAGIC.');
}

function getFiles(commandId) {

}

function deleteFile(commandId, fileId) {

}

function getFile(commandId, fileId, localPath, uploadPath) {

}

function postNewPlaylist(commandId, fileId, downloadPath, playList) {

}

function getPlaylist(commandId) {

}

function setDefaultContent(commandId, uri) {

}

function playDefault(commandId) {

}

function setRecoverContent(commandId, uri) {

}

module.exports = {
  handleMessage,
};
