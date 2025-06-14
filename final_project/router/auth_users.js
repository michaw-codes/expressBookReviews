const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    if (!username) {
        return false;
    }
    let userswithsamename = users.filter(user => {
        return user.username === username;
    });
    // Return true if any user with the same username is not found, otherwise false
    return userswithsamename.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(403).json({ message: "Invalid Login. Check username and password" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(403).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const review = req.query.review;
    const user = req.session.authorization.username;
    if (isbn in books) {
        books[isbn].reviews[user] = review;
        return res.status(200).json({
            message: 'You added review for the book with isbn: ' + isbn,
            review: review,
        });
    }
    return res.status(404).json({message: "book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
