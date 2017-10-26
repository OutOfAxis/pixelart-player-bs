const databaseService = require('./databaseService');

function initializeConfigurationAndDatabase(response) {
  databaseService.initializeConfigurationDataSet(response);
}

module.exports = {
  initializeConfigurationAndDatabase
};
