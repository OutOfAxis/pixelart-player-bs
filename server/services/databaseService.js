const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, 'todo.db')
const db = new sqlite3.Database(dbPath)

function initializeConnectionWithDataBase() {
  return new sqlite3.Database('./db/brightPixel.db', (sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE),(err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  });
}

module.exports = {
  initializeConnectionWithDataBase
};
