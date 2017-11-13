const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');

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

function getFileDetails(file) {
  const pathToFile = config.CONTENT_ADDRESS + file;
  const stats = fs.stat(pathToFile);
  const extension = path.extname(pathToFile);
  const fileSizeInBytes = fs.stat(pathToFile).size;
  console.log(stats);

  return {
    stats,
    extension,
    fileSizeInBytes,
  };
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function getResourcesDetails() {
  return new Promise((resolve, reject) => {
    fs.readdir(config.CONTENT_ADDRESS, (error, files) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      const filesDetails = [];
      asyncForEach(files, async (file) => {
        const details = await getFileDetails(file);
        filesDetails.push(details);
      });
      console.log(filesDetails);
      resolve(filesDetails);
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

function initDirectories() {
  return new Promise((resolve, reject) => {
    const dirPath = config.CONTENT_ADDRESS;
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
  getResourcesDetails,
  deleteFile,
  initDirectories,
};
