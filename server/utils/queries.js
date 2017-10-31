const createConfigurationQuery =
  'CREATE TABLE IF NOT EXISTS Configuration (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, key TEXT, value TEXT)';
const getConfigurationQuery =
  'SELECT value FROM Configuration WHERE key = \'Configuration\'';
const insertQuery = 'INSERT INTO Configuration(type, key, value) VALUES(\'JSON\', \'Configuration\', ';

module.exports = {
  createConfigurationQuery,
  getConfigurationQuery,
  insertQuery
};