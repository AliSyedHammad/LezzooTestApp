const mysql = require('mysql');
const http = require('http');
const { randomUUID } = require('crypto');

const fs = require('fs');

const PORT = process.env.PORT || 3000;


var con = mysql.createPool({
  connectionLimit: 2,
  port: 3306,
  host: "localhost",
  user: "root",
  password: "1234",
  database: "lezzoodbs"
});

let fetchStoresQuery = "SELECT * FROM stores";
let insertStoreQuery = "INSERT INTO stores (Name, LogoPath) VALUES (?, ?)";
let updateStoreQuery = "UPDATE stores set Name = ?, LogoPath = ? where idStores = ?";

let fetchCategoriesQuery = "SELECT * FROM category";
let insertCategoryQuery = "INSERT INTO category (Name, ImagePath) VALUES (?, ?)";
let updateCategoryQuery = "UPDATE category set Name = ?, ImagePath = ? where idcategory = ?";

let insertStoreCategoryForeignKeys = "INSERT INTO stores_category (idStores, idcategory) VALUES (?, ?)";

let fetchProductsQuery = "SELECT * FROM products";
let insertProductQuery = "INSERT INTO products (Name, Price, ImagePath, idcategory) VALUES (?, ?, ?, ?)";
let updateProductQuery = "UPDATE products set Name = ?, Price = ?, ImagePath = ? where idProducts = ?";



function fetchStores(res) {
    con.query(fetchStoresQuery,  function (err, result)
    {
        if (err) throw err;
        res.send(result);
    });
}

function insertStore(storeObject) {
    con.query(insertStoreQuery, [storeObject.Name, storeObject.LogoPath],  function (err, result)
    {
        if (err) throw err;
    });
}

function updateStore(storeObject) {
    con.query(updateStoreQuery, [storeObject.Name, storeObject.LogoPath, storeObject.idStores],  function (err, result)
    {
        if (err) throw err;
    });
}



function fetchCategories(res) {
    con.query(fetchCategoriesQuery,  function (err, result)
    {
        if (err) throw err;
        res.send(result);
    });
}

function insertCategory(categoryObject) {
  con.query(insertCategoryQuery, [categoryObject.Name, categoryObject.ImagePath],  function (err, result)
  {
    if (err) throw err;
    
    con.query(insertStoreCategoryForeignKeys, [categoryObject.idStores, result.insertId],  function (err, result)
    {
        if (err) throw err;
    });
  });
}

function updateCategory(categoryObject) {
    con.query(updateCategoryQuery, [categoryObject.Name, categoryObject.ImagePath, categoryObject.idcategory],  function (err, result)
    {
        if (err) throw err;
    });
}



function fetchProducts(res) {
    con.query(fetchProductsQuery,  function (err, result)
    {
        if (err) throw err;
        res.send(result);
    });
}

function insertProduct(productObject) {
    con.query(insertProductQuery, [productObject.Name, productObject.Price, productObject.ImagePath, productObject.idcategory],  function (err, result)
    {
        if (err) throw err;
    });
}
  
function updateProduct(productObject) {
    con.query(updateProductQuery, [productObject.Name, productObject.Price, productObject.ImagePath, productObject.idProducts],  function (err, result)
    {
        if (err) throw err;
    });
}



module.exports = {
    fetchStores,
    insertStore,
    updateStore,
    fetchCategories,
    insertCategory,
    updateCategory,
    fetchProducts,
    insertProduct,
    updateProduct
}