const request = require('supertest');
const app = require('../app'); // Import the app
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

describe('Movie API', () => {
    let server;
    let db;

    beforeAll((done) => {
        // Start the server
        server = http.createServer(app);
        server.listen(3000, () => {
            console.log('Test server running at http://localhost:3000');
            done();
        });

        // Initialize the database with test data
        db = new sqlite3.Database('./movies.db');
        db.serialize(() => {
            // Clear existing data
            db.run('DELETE FROM movies', (err) => {
                if (err) console.error('Error deleting movies:', err);
            });
            db.run('DELETE FROM directors', (err) => {
                if (err) console.error('Error deleting directors:', err);
            });
            db.run('DELETE FROM genres', (err) => {
                if (err) console.error('Error deleting genres:', err);
            });

            // Insert test data
            db.run('INSERT INTO directors (name) VALUES ("Christopher Nolan")', function (err) {
                if (err) console.error('Error inserting director:', err);
                else console.log('Director inserted:', this.lastID);
            });
            db.run('INSERT INTO genres (name) VALUES ("Sci-Fi")', function (err) {
                if (err) console.error('Error inserting genre:', err);
                else console.log('Genre inserted:', this.lastID);
            });
            db.run(
                'INSERT INTO movies (title, director_id, genre_id, release_year) VALUES ("Inception", 1, 1, 2010)',
                function (err) {
                    if (err) console.error('Error inserting movie:', err);
                    else console.log('Movie inserted:', this.lastID);
                }
            );
        });
    });

    afterAll((done) => {
        // Clean up the database after tests
        db.serialize(() => {
            db.run('DELETE FROM movies');
            db.run('DELETE FROM directors');
            db.run('DELETE FROM genres');
        });
        db.close();

        // Close the server
        server.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    test('GET /movies should return all movies', async () => {
        const response = await request(server).get('/movies');
        console.log('GET /movies response:', response.body); // Log the response
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /movies should add a new movie', async () => {
        const response = await request(server)
            .post('/movies')
            .send({
                title: 'Interstellar',
                director_id: 1,
                genre_id: 1,
                release_year: 2014
            });
        console.log('POST /movies response:', response.body); // Log the response
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Movie added successfully');
    });

    test('PUT /movies/:id should update a movie', async () => {
        const response = await request(server)
            .put('/movies/1')
            .send({
                title: 'Inception Updated',
                director_id: 1,
                genre_id: 1,
                release_year: 2010
            });
        console.log('PUT /movies/1 response:', response.body); // Log the response
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Movie updated successfully');
    });

    test('DELETE /movies/:id should delete a movie', async () => {
        const response = await request(server).delete('/movies/1');
        console.log('DELETE /movies/1 response:', response.body); // Log the response
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Movie deleted successfully');
    });
});