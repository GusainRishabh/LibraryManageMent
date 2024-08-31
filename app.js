import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library'
});

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Books');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

app.delete('/api/delete', async (req, res) => {
    try {
        const { bookId } = req.body;
        await pool.query('CALL delete_book(?)', [bookId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book' });
    }
});
// Get all issued books
app.get('/api/issued-books', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Books.id, Books.name 
            FROM IssuedBooks 
            JOIN Books ON IssuedBooks.book_id = Books.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching issued books' });
    }
});

// Add a new book
app.post('/api/add', async (req, res) => {
    try {
        const { bookName } = req.body;
        await pool.query('CALL insert_book(?)', [bookName]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error adding book' });
    }
});

// Issue a book
app.post('/api/issue', async (req, res) => {
    try {
        const { bookId } = req.body;
        await pool.query('CALL issue_book(?)', [bookId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error issuing book' });
    }
});

// Remove an issued book
app.post('/api/remove-issued', async (req, res) => {
    try {
        const { bookId } = req.body;
        await pool.query('CALL remove_issued_book(?)', [bookId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error removing issued book' });
    }
});

// Update a book
app.post('/api/edit', async (req, res) => {
    try {
        const { bookId, newName } = req.body;
        await pool.query('CALL update_book(?, ?)', [bookId, newName]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
