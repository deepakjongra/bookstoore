const express = require('express');
const router = express.Router();

const users = [
    {
      username: "john_doe",
      email: "john_doe@example.com",
      password: "password123",
    },
    {
      username: "jane_smith",
      email: "jane_smith@example.com",
      password: "secret456",
    },
  ];

let books = [
    {
        title:"To Kill a Mockingbird",
        author:"Harper Lee",
        ISBN:"001",
        issueDate:"10/10/2002",
        reviews: [{
            username: "john_doe",
            rating: 4,
            comment: "Great book, highly recommended!",
        },
        {
            username: "jane_smith",
            rating: 3,
            comment: "Good read, but not my favorite",
          },
    ]
    },
    {
        title:"The Great Gatsby",
        author:"Scott Fitzgerald",
        ISBN:"002",
        issueDate:"12/08/2002",
        reviews: [
            {
              username: "jane_smith",
              rating: 5,
              comment: "A timeless classic that everyone should read",
            },
          ]
    },
    {
        title:"One Hundred Years of Solitude",
        author:"García Márquez",
        ISBN:"003",
        issueDate:"08/10/2005"
    },
    {
        title:"A Passage to India",
        author:"E.M. Forster",
        ISBN:"004",
        issueDate:"27/08/2010"
    },
    {
        title:"Don Quixote",
        author:"Miguel de Cervantes",
        ISBN:"005",
        issueDate:"27/10/1615"
    }
]

router.get("/",(req,res)=>{
    res.send(books)
})

router.post("/isbn/:isbn",(req,res)=>{
    let isbn = req.params.isbn
    let filtered_books = books.filter((book)=> book.ISBN === isbn)
    res.send(filtered_books)
})

router.post("/author/:author",(req,res)=>{
    let author = req.params.author
    let filtered_books = books.filter((book)=> book.author === author)
    res.send(filtered_books)
})

router.post("/title/:title",(req,res)=>{
    let title = req.params.title
    let filtered_books = books.filter((book)=> book.title === title)
    res.send(filtered_books)
})

router.post("/review",(req,res)=>{
    res.send(reviews)
})


const getbookisbn = (isbn)=>{
let mypromise = new Promise((resolve,reject)=>{
    const book = books.filter((book)=>book.ISBN === isbn)
    if(book){
        resolve(book)
    }
    else{
        reject(`book with ${isbn} not found`)
    }
})
// .then((book)=>console.log(book))
}


router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.some(
    (user) => user.username === username || user.email === email
  );
  if (userExists) {
    res.status(400).json({ message: "Username or email already in use" });
  } else {
    const newUser = { username, email, password };
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

router.post("/login",(req,res)=>{
    const {username,password} = req.body
    const userExists = users.find((user)=>user.username === username && user.password === password)
    if(userExists){
        res.status(200).json({message:"login success"})
    }
    else{
        res.status(401).json({message:"invalid credentials"})
    }
})

router.post("/:isbn/reviews",(req,res)=>{
    const isbn = req.params.isbn
    const book = books.filter((book=>book.ISBN === isbn))
    if(book){
        const {username,rating,comment} = req.body
        const newReview = (username,rating,comment)
       book.push(newReview)
        res.status(200).json(newReview)
    }
    else{
        res.status(401).send({message:"Book Not Found"})
    }
})

router.put("/books/:isbn/reviews/:reviewId", (req, res) => {
    const isbn = req.params.isbn;
    const reviewId = parseInt(req.params.reviewId);
    const book = books.find((book) => book.isbn === isbn);
    if (book) {
      const { username, rating, comment } = req.body;
      const review = book.reviews.find((review) => reviewId === reviewId);
      if (review) {
        review.username = username;
        review.rating = rating;
        review.comment = comment;
        res.status(200).json(review);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

  router.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookPromise = new Promise((resolve, reject) => {
      const book = books.find((book) => book.ISBN === isbn);
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
    bookPromise
      .then((book) => {
        res.json(book);
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
  });

getbookisbn("001")

module.exports = router;