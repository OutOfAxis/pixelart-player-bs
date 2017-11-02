const encryption = require('../utils/encryption');
const queries = require('../utils/queries');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'BrightPixel.db');

function runPromifisiedQuery(dbContext, query) {
  return new Promise((resolve, reject) => {
    dbContext.all(query, function(error, rows) {
      if (error) {
        reject(error);
        return error;
      }
      resolve(rows);
      return rows;
    });
  });
}

function closeDatabaseConnection(dbContext) {
  return new Promise((resolve, reject) => {
    dbContext.close(function(error) {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve();
    });
  });
}

function initializeConnectionWithDataBase() {
  const db = new sqlite3.Database(dbPath);

  return runPromifisiedQuery(db, queries.QUERY_CREATE_CONFIGURATION)
    .then(() => db);
}

function executeQuery(query) {
  return initializeConnectionWithDataBase()
    .then((db) => {
      return Promise.all([db, runPromifisiedQuery(db, query)]);
    })
    .then((array) => {
      const db = array[0];
      const result = array[1];
      return Promise.all([result, closeDatabaseConnection(db)]);
    })
    .then((array) => array[0]);
}

function prepareInsertConfigurationQuery(response) {
  const encodedConfiguration = encryption.encode(JSON.stringify(response));
  return (`${queries.QUERY_INSERT_CONFIGURATION }'${encodedConfiguration}' )`);
}

function initializeDeviceIdentifier(identifier) {
  const query = `${queries.QUERY_INSERT_IDENTIFIER }'${identifier}' )`;

  return executeQuery(query);
}

function insertConfiguration(response) {
  const insertQuery = prepareInsertConfigurationQuery(response);

  return executeQuery(insertQuery);
}

function getConfiguration() {
  return executeQuery(queries.QUERY_GET_CONFIGURATION)
    .then((rows) => {
      return JSON.parse(encryption.decode(rows[0].value));
    });
}

function getDeviceIdentifier() {
  return executeQuery(queries.QUERY_GET_IDENTIFIER);
}

module.exports = {
  insertConfiguration,
  initializeDeviceIdentifier,
  getConfiguration,
  getDeviceIdentifier,
};
