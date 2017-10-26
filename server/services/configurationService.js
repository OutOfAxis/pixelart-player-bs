const databaseService = require('./databaseService');

function initializeConfigurationAndDatabase() {
    let db = databaseService.initializeConnectionWithDataBase();
    console.log(db);
  return db;
}

module.exports = {
  initializeConfigurationAndDatabase
};
