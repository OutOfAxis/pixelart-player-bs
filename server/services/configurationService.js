const databaseService = require('./databaseService');

function initializeConfigurationAndDatabase(response) {
  databaseService.initializeConfigurationDataSet(response);
}

function getConfigurationFromDatabase(){
  
}

module.exports = {
  initializeConfigurationAndDatabase
};
