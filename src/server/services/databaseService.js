const encryption = require('../utils/encryption');
const queries = require('../utils/queries');
const communication = require('../utils/config');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger').logger;
const dbPath = path.resolve(communication.DATABASE_ADDRESS, 'BrightPixel.db');

function runPromifisiedQuery(dbContext, query) {
  return new Promise((resolve, reject) => {
    dbContext.all(query, function(error, rows) {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

function closeDatabaseConnection(dbContext) {
  return new Promise((resolve, reject) => {
    dbContext.close(function(error) {
      if (error) {
        logger.error(error);
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function initializeConnectionWithDataBase() {
  const db = new sqlite3.Database(dbPath);
  await runPromifisiedQuery(db, queries.QUERY_CREATE_CONFIGURATION);

  return db;
}

async function executeQuery(query) {
  const db = await initializeConnectionWithDataBase();
  const rows = await runPromifisiedQuery(db, query);
  await closeDatabaseConnection(db);

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

  return JSON.parse(encryption.decode(rows[0].value));
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
