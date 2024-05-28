const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// let's get our sqlite3 database once when the app starts up
const db_file = process.env.DB_FILE;
const dbPath = path.join(process.cwd(), db_file);
const db = new sqlite3.cached.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if(err) {
    console.error('Error connecting to sqlite database at %s', dbPath);
    process.exit(1);
  };
  console.log('Connected to sqlite database %s', dbPath);
});

function all(sql, params) {
  return new Promise(function (resolve, reject) {
    if(params == undefined) params=[];
    db.all(sql, params, function (err, rows) {
      if (err)
        reject(err);
      else
        resolve(rows);
    });
  });
};

function run(sql, params) {
  return new Promise(function (resolve, reject) {
    if(params == undefined) params=[];
    debug('in sqliteRun, sql %s, values: %o', sql, params);
    db.run(sql, params, function (err, row) {
      if (err) {
        debug('in sqliteRun, err: %s', err);
        reject(err);
      } else {
        // per sqlite3 docs: https://github.com/TryGhost/node-sqlite3/wiki/API#runsql--param---callback
        // this.lastID - the row ID of the last row insert from this statement
        // this.changes - the number of rows affected by this statement
        // so we'll return the this object
        debug('in sqliteRun, success with stmt object this: %j', this);
        resolve(this);
      }
    });
  });
};

module.exports = {
  run,
  all
};