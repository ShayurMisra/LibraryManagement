import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    alternateTitle: {
        type: String,
        default: ""
    },
    author: {
        type: String,
    },
    language: {
        type: String,
        default: ""
    },
    publisher: {
        type: String,
        default: ""
    },
    bookCountAvailable: {
        type: Number,
    },
    bookStatus: {
        type: String,
        default: "Available"
    },
    categories: [{ 
        type: mongoose.Types.ObjectId, 
        ref: "BookCategory" 
    }],
    transactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isbn: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        default: "",
        required: true
    },
    publicationYear: {
        type: Number,
        default: new Date().getFullYear()
    }
},
{
    timestamps: true
});

export default mongoose.model("Book", BookSchema);
