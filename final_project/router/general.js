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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (isbn in books) {
        return res.status(200).json({message: books[isbn]});
    }
    return res.status(404).json({message: "book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const selectedBooks = Object.fromEntries(
        Object.entries(books).filter(
            ([id, book]) => book.author.toLowerCase() === author.toLowerCase()
        )
    );
    if (selectedBooks) {
        return res.status(200).json({message: selectedBooks});
    }
    return res.status(404).json({message: "no books found for the selected author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const selectedBooks = Object.fromEntries(
        Object.entries(books).filter(
            ([id, book]) => book.title.toLowerCase() === title.toLowerCase()
        )
    );
    if (selectedBooks) {
        return res.status(200).json({message: selectedBooks});
    }
    return res.status(404).json({message: "no books found with the selected title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (isbn in books) {
        return res.status(200).json({message: { reviews: books[isbn].reviews}});
    }
    return res.status(404).json({message: "book not found"});
});

module.exports.general = public_users;
