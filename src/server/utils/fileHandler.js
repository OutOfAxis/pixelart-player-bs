const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');

const config = require('../utils/config');

async function downloadFile(fileId, sourcePath) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(config.CONTENT_ADDRESS, fileId);
    initDirectories(path.dirname(filePath));
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
  const localPath = path.join(config.CONTENT_ADDRESS, fileId);
  const stats = fs.statSync(localPath);
  const mimeType = await path.extname(localPath);

  return {
    fileId,
    localPath,
    transferredSize: stats.size,
    mimeType,
  };
}

async function getResourcesDetails() {
  return new Promise((resolve, reject) => {
    fs.readdir(config.CONTENT_ADDRESS, (error, files) => {
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
  fs.unlink(filePath, (fsErr) => {
    if (fsErr) {
      console.log(`Error during deleting file ${filePath}: ${fsErr}`);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
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
