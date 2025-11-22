const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const colors = require('colors')

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('[DB] '.red, err.message)
    } else {
        console.log('[DB] Database connected.\n'.green);
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        userId INTEGER NOT NULL PRIMARY KEY,        
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        
        avatar TEXT,

        brilliant INTEGER DEFAULT 0,
        best INTEGER DEFAULT 0,
        good INTEGER DEFAULT 0,
        inaccuracy INTEGER DEFAULT 0,
        mistake INTEGER DEFAULT 0,
        blunder INTEGER DEFAULT 0,
        
        successRate INTEGER DEFAULT 0,
        totalGames INTEGER DEFAULT 0
    )`, (err) => {
        if (err) console.log('[DB] '.red, err.message);
    });

    db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        code TEXT NOT NULL,
        unlocked INTEGER DEFAULT 0,
        unlockedAt DATETIME,

        FOREIGN KEY(userId) REFERENCES users(userId)
    )`);

});

module.exports = db;
