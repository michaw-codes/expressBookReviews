const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    errors = [];
    if (!username) {
        errors.push("username is required but was not provided");
    } else if (!isValid(username)) {
        errors.push("username already exists");
    }
    if (!password) {
        errors.push("password is required but was not provided");
    }
    if (errors.length === 0) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    // Return error if username or password is missing
    return res.status(400).json({
        message: "Unable to register user.",
        errors: errors
    });
});

const getBooks = async () => {
    // Simulating waiting for results of database query
    await new Promise(resolve => setTimeout(resolve, 500));
    return books;
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // getBooks() simulates waiting for getting books from a Database
        const books = await getBooks();
        return res.status(200).json({ message: books });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = parseInt(req.params.isbn);
        // getBooks() simulates waiting for getting books from a Database
        const books = await getBooks();
        if (isbn in books) {
            return res.status(200).json({message: books[isbn]});
        }
        return res.status(404).json({message: "book not found"});
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        // getBooks() simulates waiting for getting books from a Database
        const books = await getBooks();
        const selectedBooks = Object.fromEntries(
            Object.entries(books).filter(
                ([id, book]) => book.author.toLowerCase() === author.toLowerCase()
            )
        );
        if (selectedBooks) {
            return res.status(200).json({message: selectedBooks});
        }
        return res.status(404).json({message: "no books found for the selected author"});
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        // getBooks() simulates waiting for getting books from a Database
        const books = await getBooks();
        const selectedBooks = Object.fromEntries(
            Object.entries(books).filter(
                ([id, book]) => book.title.toLowerCase() === title.toLowerCase()
            )
        );
        if (selectedBooks) {
            return res.status(200).json({message: selectedBooks});
        }
        return res.status(404).json({message: "no books found with the selected title"});
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = parseInt(req.params.isbn);
        // getBooks() simulates waiting for getting books from a Database
        const books = await getBooks();
        if (isbn in books) {
            return res.status(200).json({message: { reviews: books[isbn].reviews}});
        }
        return res.status(404).json({message: "book not found"});
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports.general = public_users;
