document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:4000/api/books';
    const bookList = document.getElementById('bookList');
    const addBookForm = document.getElementById('addBookForm');
    const updateBookFormContainer = document.getElementById('updateBookFormContainer');
    const updateBookForm = document.getElementById('updateBookForm');
    const cancelUpdateButton = document.getElementById('cancelUpdate');

    // Fetch and display books
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${apiUrl}/allbooks`);
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Display books in the list
    const displayBooks = (books) => {
        bookList.innerHTML = '<h3>Available Books</h3>';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <h4>${book.bookName}</h4>
                <p>Author: ${book.author}</p>
                <p>ISBN: ${book.isbn || 'N/A'}</p>
                <p>Genre: ${book.genre || 'N/A'}</p>
                <p>Publication Year: ${book.publicationYear || 'N/A'}</p>
                <p>Language: ${book.language || 'N/A'}</p>
                <p>Available Count: ${book.bookCountAvailable}</p>
                <button onclick="editBook('${book._id}')">Edit</button>
                <button onclick="deleteBook('${book._id}')">Delete</button>
            `;
            bookList.appendChild(bookItem);
        });
    };

    // Add new book
    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const bookData = {
            bookName: document.getElementById('bookName').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            genre: document.getElementById('genre').value,
            publicationYear: document.getElementById('publicationYear').value,
            language: document.getElementById('language').value,
            bookCountAvailable: document.getElementById('bookCountAvailable').value,
        };

        try {
            const response = await fetch(`${apiUrl}/addbook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            if (response.ok) {
                alert('Book added successfully');
                addBookForm.reset();
                fetchBooks(); // Refresh the book list
            } else {
                const error = await response.json();
                alert(`Error adding book: ${error.message}`);
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    });

    // Edit book and populate the form
    window.editBook = async (bookId) => {
        try {
            const response = await fetch(`${apiUrl}/getbook/${bookId}`);
            const book = await response.json();
            if (response.ok) {
                document.getElementById('updateBookId').value = book._id;
                document.getElementById('updateBookName').value = book.bookName;
                document.getElementById('updateAuthor').value = book.author;
                document.getElementById('updateIsbn').value = book.isbn || '';
                document.getElementById('updateGenre').value = book.genre || '';
                document.getElementById('updatePublicationYear').value = book.publicationYear || '';
                document.getElementById('updateLanguage').value = book.language || '';
                document.getElementById('updateBookCountAvailable').value = book.bookCountAvailable;

                updateBookFormContainer.style.display = 'block';
            } else {
                alert('Error fetching book details');
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    // Update book
    updateBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const bookData = {
            bookName: document.getElementById('updateBookName').value,
            author: document.getElementById('updateAuthor').value,
            isbn: document.getElementById('updateIsbn').value,
            genre: document.getElementById('updateGenre').value,
            publicationYear: document.getElementById('updatePublicationYear').value,
            language: document.getElementById('updateLanguage').value,
            bookCountAvailable: document.getElementById('updateBookCountAvailable').value,
        };

        const bookId = document.getElementById('updateBookId').value;

        try {
            const response = await fetch(`${apiUrl}/updatebook/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            if (response.ok) {
                alert('Book updated successfully');
                updateBookFormContainer.style.display = 'none';
                fetchBooks(); // Refresh the book list
            } else {
                const error = await response.json();
                alert(`Error updating book: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    });

    // Cancel update
    cancelUpdateButton.addEventListener('click', () => {
        updateBookFormContainer.style.display = 'none';
    });

    // Delete a book
    window.deleteBook = async (bookId) => {
        try {
            const response = await fetch(`${apiUrl}/removebook/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Book deleted successfully');
                fetchBooks(); // Refresh the book list
            } else {
                const error = await response.json();
                alert(`Error deleting book: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    fetchBooks(); // Initial fetch to display books
});