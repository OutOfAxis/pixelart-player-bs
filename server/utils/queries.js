const createConfigurationQuery =
  'CREATE TABLE IF NOT EXISTS Configuration (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, key TEXT, value TEXT)';
const getConfigurationQuery = 'SELECT value FROM Configuration WHERE key = \'Configuration\'';
const insertConfigurationQuery = 'INSERT INTO Configuration(type, key, value) VALUES(\'JSON\', \'Configuration\', ';
const insertIdentifierQuery = 'INSERT INTO Configuration(type, key, value) VALUES(\'UUID\', \'Identifier\', ';
const getIdentifierQuery = 'SELECT value FROM Configuration WHERE key = \'Identifier\'';


module.exports = {
  createConfigurationQuery,
  getConfigurationQuery,
  insertConfigurationQuery,
  insertIdentifierQuery,
  getIdentifierQuery,
};
