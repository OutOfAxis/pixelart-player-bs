const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'BrightPixel.db');
const createConfigurationQuery =
  'CREATE TABLE IF NOT EXISTS Configuration (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, key TEXT, value TEXT)';
const getConfigurationQuery =
  'SELECT value FROM Configuration WHERE key = \'Configuration\'';

function initializeConnectionWithDataBase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  });
  return db;
}

function prepareInsertConfigurationQuery(response) {
  return (`${'INSERT INTO Configuration(type, key, value) VALUES(\'JSON\', \'Configuration\', '}
    ${'\''}${JSON.stringify(response)}${'\' )'}`);
}

function initializeConfigurationDataSet(response) {
  const db = initializeConnectionWithDataBase();
  db.run(createConfigurationQuery);
  const insertQuery = prepareInsertConfigurationQuery(response);
  db.run(insertQuery);
  db.close();
}

function getConfiguration() {
  const db = initializeConnectionWithDataBase();

  return new Promise((resolve, reject) => {
    db.all(getConfigurationQuery, function(error, rows) {
      if (error) {
        reject(error);
      }
      db.close();
      resolve(JSON.parse(rows[0].value));
    });
  });
}

module.exports = {
  initializeConfigurationDataSet,
  getConfiguration,
};
