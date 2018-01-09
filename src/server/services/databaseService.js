const communication = require('../utils/config');
const fileHandler = require('../utils/fileHandler');
const exists = require('exists-file');

const path = require('path');
const dbPath = path.resolve(communication.DATABASE_ADDRESS, 'bs-player-config.json');

async function initializeConnectionWithDataBase() {
  let configuration = null;
  if (await exists(dbPath)) {
    configuration = await fileHandler.getFileContent(dbPath);
  }

  return JSON.parse(configuration);
}

async function updateConfiguration(propertyName, propertyValue) {
  const configuration = await initializeConnectionWithDataBase();

  configuration[propertyName] = propertyValue;

  return await fileHandler.createNewFile(dbPath, JSON.stringify(configuration));
}

async function getConfiguration() {
  const config = await initializeConnectionWithDataBase();

  return config;
}


module.exports = {
  updateConfiguration,
  getConfiguration,
};
