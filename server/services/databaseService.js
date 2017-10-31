const encryption = require('../utils/encryption');
const queries = require('../utils/queries');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'BrightPixel.db');

function initializeConnectionWithDataBase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the BrightPixel database.');
  });
  db.run(queries.createConfigurationQuery);
  return db;
}

function prepareInsertConfigurationQuery(response) {
  return (`${queries.insertQuery}
    ${'\''}${encryption.encode(JSON.stringify(response))}${'\' )'}`);
}

function initializeConfigurationDataSet(response) {
  const db = initializeConnectionWithDataBase();
  const insertQuery = prepareInsertConfigurationQuery(response);
  db.run(insertQuery);
  db.close();
}

function getConfiguration() {
  const db = initializeConnectionWithDataBase();

  return new Promise((resolve, reject) => {
    db.all(queries.getConfigurationQuery, function(error, rows) {
      if (error) {
        reject(error);
      }
      db.close();
      resolve(JSON.parse(encryption.decode(rows[0].value)));
    });
  });
}

module.exports = {
  initializeConfigurationDataSet,
  getConfiguration,
};
