const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using async/await and axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('https://nuralibiznes-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Task 11: Get book details by ISBN using async/await and axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`https://nuralibiznes-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/isbn/${isbn}`);
    if (response.data) {
      res.send(response.data);
    } else {
        res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});

// Task 12: Get book details by author using async/await and axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`https://nuralibiznes-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`);
         if (response.data && response.data.length > 0) {
            res.send(response.data);
        } else {
            res.status(404).json({message:"Book not found"});
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Task 13: Get book details by title using async/await and axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
      try {
        const response = await axios.get(`https://nuralibiznes-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`);
        if (response.data && response.data.length > 0) {
          res.send(response.data);
        } else {
            res.status(404).json({message:"Book not found"});
        }
    } catch (error) {
         res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]){
        res.send(books[isbn].reviews)
    }else{
        res.status(404).json({message:"Book not found"});
    }
});

module.exports.general = public_users;