const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const request = require('request');
const { randomUUID } = require('crypto');
const glob = require("glob");
const dbUtils = require("../utils/db_utils");

// const multer = require('multer');
// const upload = multer({dest:__dirname + "/src/assets"});

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    maxHttpBufferSize: 1e8, pingTimeout: 60000
});
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(express.urlencoded({ extended: false }));

// 

app.post('/fetchStores', (req, res) => {
    console.log(req.body);
    dbUtils.fetchStores(res);
})

app.post('/insertStore', (req, res) => {
    console.log(req.body);
    dbUtils.insertStore(req.body);

    res.send(200);
})

app.post('/updateStore', (req, res) => {
    console.log(req.body);
    dbUtils.updateStore(req.body);

    res.send(200);
})



app.post('/fetchCategories', (req, res) => {
    console.log(req.body);
    dbUtils.fetchCategories(res);
})

app.post('/insertCategory', (req, res) => {
    console.log(req.body);
    dbUtils.insertCategory(req.body);

    res.send(200);
})

app.post('/updateCategory', (req, res) => {
    console.log(req.body);
    dbUtils.updateCategory(req.body);

    res.send(200);
})



app.post('/fetchProducts', (req, res) => {
    console.log(req.body);
    dbUtils.fetchProducts(res);
})

app.post('/insertProducts', (req, res) => {
    console.log(req.body);
    dbUtils.insertProduct(req.body);

    res.send(200);
})

app.post('/updateProducts', (req, res) => {
    console.log(req.body);
    dbUtils.updateProduct(req.body);

    res.send(200);
})


app.listen(PORT, () => {
    console.log("Server listening on *:" + PORT)
});