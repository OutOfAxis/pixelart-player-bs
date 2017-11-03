const QUERY_CREATE_CONFIGURATION =
  'CREATE TABLE IF NOT EXISTS Configuration (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, key TEXT, value TEXT)';
const QUERY_GET_CONFIGURATION = 'SELECT value FROM Configuration WHERE key = \'Configuration\'';
const QUERY_INSERT_CONFIGURATION = 'INSERT INTO Configuration(type, key, value) VALUES(\'JSON\', \'Configuration\', ';
const QUERY_INSERT_IDENTIFIER = 'INSERT INTO Configuration(type, key, value) VALUES(\'UUID\', \'Identifier\', ';
const QUERY_GET_IDENTIFIER = 'SELECT value FROM Configuration WHERE key = \'Identifier\'';


module.exports = {
  QUERY_CREATE_CONFIGURATION,
  QUERY_GET_CONFIGURATION,
  QUERY_INSERT_CONFIGURATION,
  QUERY_INSERT_IDENTIFIER,
  QUERY_GET_IDENTIFIER,
};
