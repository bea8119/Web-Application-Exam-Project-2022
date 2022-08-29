'use strict';

const sqlite = require('sqlite3');

class DBHandler {
    constructor(dbPath) {
        this.db = new sqlite.Database(dbPath, (err) => {
            if (err) console.log('Error connecting to database.');
            else (console.log("Connected to DB"));
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running SQL:' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running SQL: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running SQL: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

}

module.exports = DBHandler;