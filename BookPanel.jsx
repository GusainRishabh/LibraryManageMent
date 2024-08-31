import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookPanel.css';

const StudentPanel = () => {
    const [books, setBooks] = useState([]);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [newBookName, setNewBookName] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [bookToUpdate, setBookToUpdate] = useState(null);

    // Fetch books from the server
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch issued books from the server
    const fetchIssuedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/issued-books');
            setIssuedBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Add a new book
    const addBook = async () => {
        try {
            await axios.post('http://localhost:5000/api/add', { bookName: newBookName });
            fetchBooks();
            setNewBookName('');
        } catch (error) {
            console.error(error);
        }
    };

    // Issue a book
    const issueBook = async (bookId) => {
        if (issuedBooks.length < 5) {
            try {
                await axios.post('http://localhost:5000/api/issue', { bookId });
                fetchIssuedBooks();
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('You can only issue up to 5 books.');
        }
    };

    // Remove an issued book
    const removeIssuedBook = async (bookId) => {
        try {
            await axios.post('http://localhost:5000/api/remove-issued', { bookId });
            fetchIssuedBooks();
        } catch (error) {
            console.error(error);
        }
    };

    // Update a book
    const updateBook = async () => {
        try {
            await axios.post('http://localhost:5000/api/edit', { bookId: bookToUpdate.id, newName: updatedName });
            fetchBooks(); // Refresh the available books list after update
            setUpdatedName('');
            setBookToUpdate(null);
        } catch (error) {
            console.error(error);
        }
    };

    // Delete a book from the master table
    const deleteBook = async (bookId) => {
        try {
            await axios.delete('http://localhost:5000/api/delete', { data: { bookId } });
            fetchBooks(); // Refresh the book list after deletion
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchIssuedBooks();
    }, []);

    return (
        <div className="student-panel">
            <h1>Library Management</h1>
            <div className="available-books">
                <h2>Available Books</h2>
                <div className="book-grid">
                    {books.map(book => (
                        <div key={book.id} className="book-card">
                            <p>{book.name}</p>
                            <div className="button-group">
                                <button onClick={() => issueBook(book.id)} className="issue-button">Issue</button>
                                <button onClick={() => deleteBook(book.id)} className="delete-button">Delete</button>
                                <button onClick={() => setBookToUpdate(book)} className="update-button">Update</button> {/* Update Button */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="issued-books">
                <h2>Issued Books</h2>
                <div className="book-grid">
                    {issuedBooks.map(book => (
                        <div key={book.id} className="book-card">
                            <p>{book.name}</p>
                            <button onClick={() => removeIssuedBook(book.id)} className="remove-button">Remove</button>
                        </div>
                    ))}
                </div>
                {bookToUpdate && (
                    <div className="update-section">
                        <input
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="New name"
                            className="update-input"
                        />
                        <button onClick={updateBook} className="update-button">Save</button>
                    </div>
                )}
            </div>
            <div className="add-book">
                <input
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    placeholder="Book Name"
                    className="new-book-input"
                />
                <button onClick={addBook} className="add-button">Add Book</button>
            </div>
        </div>
    );
};

export default StudentPanel;
