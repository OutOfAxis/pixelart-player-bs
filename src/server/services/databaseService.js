
console.log('eoooo');
const encryption = require('../utils/encryption');
const queries = require('../utils/queries');
const communication = require('../utils/config');

const path = require('path');
const dbPath = path.resolve(communication.DATABASE_ADDRESS, 'BrightPixel.db');
const dblite = require('dblite');
const dataBase = dblite(dbPath);

const logger = require('../utils/logger').logger;

function runPromifisiedQuery(dbContext, query) {
  return new Promise((resolve, reject) => {
    dbContext.query(query, function(error, rows) {
      if (error) {
        logger.error(error);
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function initializeConnectionWithDataBase() {
  await runPromifisiedQuery(dataBase, queries.QUERY_CREATE_CONFIGURATION);

  return dataBase;
}

async function executeQuery(query) {
  const db = await initializeConnectionWithDataBase();
  const rows = await runPromifisiedQuery(db, query);

  return rows;
}

function prepareInsertConfigurationQuery(response) {
  const encodedConfiguration = encryption.encode(JSON.stringify(response));

  return (`${queries.QUERY_INSERT_CONFIGURATION }'${encodedConfiguration}' )`);
}

function prepareInsertDefaultContentQuery(response) {
  const encodedDefaultContent = encryption.encode(JSON.stringify(response));

  return (`${queries.QUERY_INSERT_DEFAULT_CONTENT }'${encodedDefaultContent}' )`);
}

function initializeDeviceIdentifier(identifier) {
  const query = `${queries.QUERY_INSERT_IDENTIFIER }'${identifier}' )`;

  return executeQuery(query);
}

function insertConfiguration(response) {
  const insertQuery = prepareInsertConfigurationQuery(response);

  return executeQuery(insertQuery);
}

async function insertDefaultContent(response) {
  const insertQuery = prepareInsertDefaultContentQuery(response);

  return await executeQuery(insertQuery);
}

async function getConfiguration() {
  const rows = await executeQuery(queries.QUERY_GET_CONFIGURATION);
  console.log(rows);

  return JSON.parse(encryption.decode(rows));
}

function getDeviceIdentifier() {
  return executeQuery(queries.QUERY_GET_IDENTIFIER);
}

module.exports = {
  insertConfiguration,
  initializeDeviceIdentifier,
  getConfiguration,
  getDeviceIdentifier,
  insertDefaultContent,
};
