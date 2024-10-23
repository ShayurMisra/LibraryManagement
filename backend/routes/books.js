import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 });
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions");
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Adding book */
router.post("/addbook", async (req, res) => {
    try {
        const newBook = new Book({
            bookName: req.body.bookName,
            alternateTitle: req.body.alternateTitle,
            author: req.body.author,
            isbn: req.body.isbn,
            genre: req.body.genre,
            publicationYear: req.body.publicationYear,
            language: req.body.language,
            publisher: req.body.publisher,
            bookCountAvailable: req.body.bookCountAvailable,
            bookStatus: req.body.bookStatus,
            categories: req.body.categories
        });

        const book = await newBook.save();
        
        // Update BookCategory documents to include this new book
        if (book.categories && book.categories.length > 0) {
            await BookCategory.updateMany(
                { '_id': { $in: book.categories } },
                { $push: { books: book._id } }
            );
        }

        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Updating book */
router.put("/updatebook/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Remove book */
router.delete("/removebook/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        // Update BookCategory documents to remove this book
        if (book.categories && book.categories.length > 0) {
            await BookCategory.updateMany(
                { '_id': { $in: book.categories } },
                { $pull: { books: book._id } }
            );
        }

        res.status(200).json({ message: "Book has been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

    // Search books by ISBN, title, author, or genre
    router.get('/searchbooks', async (req, res) => {
        const query = req.query.query;
        try {
            const books = await Book.find({
                $or: [
                    { bookName: new RegExp(query, 'i') },
                    { isbn: query }
                ]
            });
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


export default router;
