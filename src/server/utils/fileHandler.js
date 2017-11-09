const fs = require('fs');
const request = require('request');

async function downloadFile(fileId, downloadPath, sourcePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(sourcePath);
    const sendReq = request.get(downloadPath);

    // verify response code
    sendReq.on('response', function(response) {
      if (response.statusCode !== 200) {
        return resolve(`Response status was ${ response.statusCode}`);
      }
    });

    // check for request errors
    sendReq.on('error', function(err) {
      fs.unlink(sourcePath);
      return reject(err.message);
    });

    sendReq.pipe(file);

    file.on('finish', function() {
      file.close(() => resolve('im done!!!'));  // close() is async, call cb after close completes.
    });

    file.on('error', function(err) { // Handle errors
      fs.unlink(sourcePath); // Delete the file async. (But we don't check the result)
      return reject(err.message);
    });
  });
}

function createNewFile(fileId, downloadPath, content) {
  console.log(`File ${ fileId } has been created.`);
}

module.exports = {
  downloadFile,
};
