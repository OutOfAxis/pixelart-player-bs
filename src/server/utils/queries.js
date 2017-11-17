const QUERY_CREATE_CONFIGURATION =
  'CREATE TABLE IF NOT EXISTS Configuration (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, key TEXT, value TEXT)';
const QUERY_GET_CONFIGURATION = 'SELECT value FROM Configuration WHERE key = \'Configuration\'';
const QUERY_INSERT_CONFIGURATION = 'INSERT INTO Configuration(type, key, value) VALUES(\'JSON\', \'Configuration\', ';
const QUERY_INSERT_IDENTIFIER = 'INSERT INTO Configuration(type, key, value) VALUES(\'UUID\', \'Identifier\', ';
const QUERY_GET_IDENTIFIER = 'SELECT value FROM Configuration WHERE key = \'Identifier\'';
const QUERY_INSERT_DEFAULT_CONTENT = 'INSERT INTO Configuration(type, key, value) VALUES(\'TEXT\', \'DefaultContent\', ';
const QUERY_GET_DEFAULT_CONTENT = 'SELECT value FROM Configuration WHERE key = \'DefaultContent\'';


module.exports = {
  QUERY_CREATE_CONFIGURATION,
  QUERY_GET_CONFIGURATION,
  QUERY_INSERT_CONFIGURATION,
  QUERY_INSERT_IDENTIFIER,
  QUERY_GET_IDENTIFIER,
  QUERY_INSERT_DEFAULT_CONTENT,
  QUERY_GET_DEFAULT_CONTENT,
};
