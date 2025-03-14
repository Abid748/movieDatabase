const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./movies.db');

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS actors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            director_id INTEGER,
            genre_id INTEGER,
            release_year INTEGER,
            FOREIGN KEY (director_id) REFERENCES directors (id),
            FOREIGN KEY (genre_id) REFERENCES genres (id)
        )
    `);
});

db.close();