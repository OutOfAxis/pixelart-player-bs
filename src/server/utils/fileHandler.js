const fs = require('fs');
const request = require('request');

const config = require('../utils/config');

async function downloadFile(fileId, downloadPath, sourcePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(sourcePath);
    const sendReq = request.get(downloadPath);

    sendReq.on('error', function(err) {
      fs.unlink(sourcePath);
      reject(err.message);
    });

    sendReq.pipe(file);

    file.on('finish', function() {
      file.close(() => resolve());
    });

    file.on('error', function(err) {
      fs.unlink(sourcePath);
      reject(err.message);
    });
  });
}

function createNewFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (error) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function getFileContent(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      if (!data) {
        data = '[]';
      }

      resolve(data);
    });
  });
}

module.exports = {
  downloadFile,
  createNewFile,
  getFileContent,
};
