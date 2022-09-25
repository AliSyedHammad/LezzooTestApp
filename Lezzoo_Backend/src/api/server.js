const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const dbUtils = require("../utils/db_utils");


const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3002;

const cors = require('cors');
app.use(cors());


app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));


app.get('/fetchStores', (req, res) => {
    return dbUtils.fetchStores(res);
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



app.get('/fetchCategories', (req, res) => {
    if (req.query.idStores == null)
        return dbUtils.fetchSpecificCategories(res);
        
    return dbUtils.fetchSpecificCategoriesName(req.query, res);
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



app.get('/fetchProducts', (req, res) => {
    if (req.query.idStores == null)
        return dbUtils.fetchProducts(res);

    return dbUtils.fetchSpecificProducts(req.query, res);
})

app.post('/insertProduct', (req, res) => {
    console.log(req.body);
    dbUtils.insertProduct(req.body);

    res.send(200);
})

app.post('/updateProduct', (req, res) => {
    console.log(req.body);
    dbUtils.updateProduct(req.body);

    res.send(200);
})


app.listen(PORT, () => {
    console.log("Server listening on *:" + PORT)
});