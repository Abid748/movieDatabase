const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./movies.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

// Routes
app.get('/movies', (req, res) => {
    db.all('SELECT * FROM movies', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/movies', (req, res) => {
    const { title, director_id, genre_id, release_year } = req.body;
    db.run(
        'INSERT INTO movies (title, director_id, genre_id, release_year) VALUES (?, ?, ?, ?)',
        [title, director_id, genre_id, release_year],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Movie added successfully', id: this.lastID });
        }
    );
});

app.put('/movies/:id', (req, res) => {
    const { title, director_id, genre_id, release_year } = req.body;
    const movieId = req.params.id;
    db.run(
        'UPDATE movies SET title = ?, director_id = ?, genre_id = ?, release_year = ? WHERE id = ?',
        [title, director_id, genre_id, release_year, movieId],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Movie updated successfully' });
        }
    );
});

app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    db.run('DELETE FROM movies WHERE id = ?', [movieId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Movie deleted successfully' });
    });
});

// Export the app for testing
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}