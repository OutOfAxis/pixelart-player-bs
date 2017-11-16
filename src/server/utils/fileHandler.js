const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const recursive = require('recursive-readdir');

const config = require('../utils/config');

async function downloadFile(fileId, sourcePath) {
  const filePath = path.join(config.CONTENT_ADDRESS, fileId);
  await initDirectories(path.dirname(filePath));
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const sendReq = request.get(sourcePath);

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

function createNewFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (error) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function getFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
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

async function getFileDetails(fileId) {
  return new Promise((resolve, reject) => {
    fs.stat(fileId, function(error, stats) {
      if (error) {
        reject(error);
        return;
      }
      const mimeType = path.extname(fileId);

      resolve({
        fileId: fileId.replace(config.CONTENT_ADDRESS, ''),
        localPath: fileId,
        transferredSize: stats.size,
        mimeType,
      });
    });
  });
}

async function getResourcesDetails() {
  return new Promise((resolve, reject) => {
    recursive(config.CONTENT_ADDRESS, (error, files) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      const promises = files.map((file) => getFileDetails(file));
      resolve(Promise.all(promises));
    });
  });
}

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    const pathToFile = path.join(config.CONTENT_ADDRESS, filePath);
    fs.unlink(pathToFile, (fsErr) => {
      if (fsErr) {
        reject(fsErr);
        return;

      }
      resolve();
    });
  });
}

function initDirectories(dirPath) {
  return new Promise((resolve, reject) => {
    mkdirp(dirPath, (error) => {
      if (error) {
        console.log(`Error during creating directory: ${error}`);
        reject(error);
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  downloadFile,
  createNewFile,
  getFileContent,
  getFileDetails,
  getResourcesDetails,
  deleteFile,
  initDirectories,
};
