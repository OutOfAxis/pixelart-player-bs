const communication = require('../utils/config');
const fileHandler = require('../utils/fileHandler');
const exists = require('exists-file');

const path = require('path');
const dbPath = path.resolve(communication.DATABASE_ADDRESS, 'brightPixel.json');
const defaultContentPath = path.resolve(communication.DATABASE_ADDRESS, 'defaultContent.json');

async function initializeConnectionWithDataBase() {
  let configuration = {
    Configuration: {
      id: null,
      config: null,
    },
  };
  let db = null;

  if (await exists(dbPath)) {
    db = await fileHandler.getFileContent(dbPath);
  }
  if (db !== '[]' && db !== null) {
    configuration = JSON.parse(db);
  } else {
    await fileHandler.createNewFile(dbPath, JSON.stringify(configuration));
  }

  return configuration;
}
async function initializeDeviceIdentifier(identifier) {
  const configuration = await initializeConnectionWithDataBase();
  configuration.Configuration.id = identifier;

  await fileHandler.createNewFile(dbPath, JSON.stringify(configuration));
}

async function insertConfiguration(identifier, config) {
  const configuration = await initializeConnectionWithDataBase();

  if (identifier !== null) {
    configuration.Configuration.id = identifier;
  }
  configuration.Configuration.config = config;
  await fileHandler.createNewFile(dbPath, JSON.stringify(configuration));
}

async function getConfiguration() {
  const config = await initializeConnectionWithDataBase();

  return config.Configuration;
}

async function insertDefaultContent(response) {
  await fileHandler.createNewFile(defaultContentPath, response);
}


module.exports = {
  insertConfiguration,
  initializeDeviceIdentifier,
  getConfiguration,
  insertDefaultContent,
};
