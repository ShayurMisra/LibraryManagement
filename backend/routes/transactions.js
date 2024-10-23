import express from "express";
import Book from "../models/Book.js";
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router();

// Add a new transaction
router.post("/add-transaction", async (req, res) => {
    try {
        const newTransaction = new BookTransaction({
            bookId: req.body.bookId,
            borrowerId: req.body.borrowerId,
            bookName: req.body.bookName,
            borrowerName: req.body.borrowerName,
            transactionType: req.body.transactionType,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate
        });
        
        const transaction = await newTransaction.save();
        const book = await Book.findById(req.body.bookId);
        await book.updateOne({ $push: { transactions: transaction._id } });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all transactions
router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a transaction
router.put("/update-transaction/:id", async (req, res) => {
    try {
        const updatedTransaction = await BookTransaction.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json("Transaction details updated successfully");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove a transaction
router.delete("/remove-transaction/:id", async (req, res) => {
    try {
        const transaction = await BookTransaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const book = await Book.findById(transaction.bookId);
        await book.updateOne({ $pull: { transactions: req.params.id } });

        res.status(200).json("Transaction deleted successfully");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
