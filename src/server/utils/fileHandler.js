const fs = require('fs');
const request = require('request');

async function downloadFile(fileId, downloadPath, sourcePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(sourcePath);
    const sendReq = request.get(downloadPath);

    sendReq.on('error', function(err) {
      fs.unlink(sourcePath);
      reject(err.message);
      return;
    });

    sendReq.pipe(file);

    file.on('finish', function() {
      file.close(() => resolve());
    });

    file.on('error', function(err) {
      fs.unlink(sourcePath);
      reject(err.message);
      return;
    });
  });
}

function createNewFile(fileId, downloadPath, content) {
  console.log(`File ${ fileId } has been created.`);
}

module.exports = {
  downloadFile,
};
