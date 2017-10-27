const databaseService = require('./databaseService');

function initializeConfigurationAndDatabase(response) {
  databaseService.initializeConfigurationDataSet(response);
}

function getConfigurationFromDatabase() {
  return databaseService.getConfiguration();
}

function getUserAndPasswordFromConfiguration(done){
  return getConfigurationFromDatabase()
    .then((config) => {
      return {
        user: config.name,
        password: config.password,
        playerId: config.playerId,
      };
    });
}

module.exports = {
  initializeConfigurationAndDatabase,
  getUserAndPasswordFromConfiguration,
};
