const express = require('express');
const routes = require('./books.js');

const app = express();
const PORT =5000;

app.use(express.json());

app.use("/book", routes);

app.listen(PORT,()=>console.log("Server is running at port "+PORT));