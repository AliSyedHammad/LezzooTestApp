const mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit: 2,
  port: 3306,
  host: "localhost",
  user: "root",
  password: "1234",
  database: "lezzoodbs"
});

let fetchStoresQuery = "SELECT * FROM stores";
let insertStoreQuery = "INSERT INTO stores (Name, Logo) VALUES (?, ?)";
let updateStoreQuery = "UPDATE stores set Name = ?, Logo = ? where idStores = ?";

let fetchCategoriesQuery = "SELECT * FROM category";
let fetchSpecificCategoriesQuery = "SELECT idcategory, Name, Image FROM category where idcategory in (select idcategory from stores_category where idStores = ?)";
let fetchSpecificCategoriesNameQuery = "SELECT Name FROM category where idcategory in (select idcategory from stores_category where idStores = ?)";
let insertCategoryQuery = "INSERT INTO category (Name, Image) VALUES (?, ?)";
let updateCategoryQuery = "UPDATE category set Name = ?, Image = ? where idcategory = ?";

let insertStoreCategoryForeignKeys = "INSERT INTO stores_category (idStores, idcategory) VALUES (?, ?)";

let fetchProductsQuery = "SELECT * FROM products";
let fetchSpecificProductsQuery = "SELECT * FROM products where idcategory in (?)";
let fetchCategoryId = "select category.idcategory from category, stores_category where category.Name = ? and stores_category.idStores = ? and stores_category.idcategory = category.idcategory";
let insertProductQuery = "INSERT INTO products (Name, Price, Image, idcategory) VALUES (?, ?, ?, ?)";
let updateProductQuery = "UPDATE products set Name = ?, Price = ?, ImagePath = ? where idProducts = ?";



function fetchStores(res) {
    con.query(fetchStoresQuery,  function (err, result)
    {
        if (err) throw err;
        res.send(result);
    });
}

function insertStore(storeObject) {
    con.query(insertStoreQuery, [storeObject.Name, storeObject.Logo],  function (err, result)
    {
        if (err) throw err;
    });
}

function updateStore(storeObject) {
    con.query(updateStoreQuery, [storeObject.Name, storeObject.Logo, storeObject.idStores],  function (err, result)
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

function fetchSpecificCategories(storeObject, res) {
    con.query(fetchSpecificCategoriesQuery, [storeObject.idStores],  function (err, result)
    {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
}

function fetchSpecificCategoriesName(storeObject, res) {
    con.query(fetchSpecificCategoriesNameQuery, [storeObject.idStores],  function (err, result)
    {
        if (err) throw err;

        var categories = [];

        for (var i = 0; i < result.length; i++) {
            categories.push(result[i].Name);
        }

        res.send(categories);
    });
}
function insertCategory(categoryObject) {
  con.query(insertCategoryQuery, [categoryObject.Name, categoryObject.Image],  function (err, result)
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

function fetchSpecificProducts(categoryObject, res) {
    con.query(fetchSpecificCategoriesQuery, [categoryObject.idStores],  function (err, result)
    {
        if (err) throw err;
        if (result.length < 1) return res.send([]);
        // res.send(result);
        categ_prod_arr = [];
        categs_id_only = [];

        for (var i = 0; i < result.length; i++) {
            categ_prod_arr.push({idcategory: result[i].idcategory, Name:result[i].Name, Image:result[i].Image, products:[]});
            categs_id_only.push(result[i].idcategory);
        }

        con.query(fetchSpecificProductsQuery, [categs_id_only],  function (err, result)
        {
            if (err) throw err;

            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < categ_prod_arr.length; j++) {
                    if (result[i].idcategory == categ_prod_arr[j].idcategory)
                        categ_prod_arr[j].products.push({Name:result[i].Name, Price:result[i].Price, Image:result[i].Image});
                }
            }

            res.send(categ_prod_arr);
        });
    });
}

function insertProduct(productObject) {
    con.query(fetchCategoryId, [productObject.Category, productObject.idStores],  function (err, result)
    {
        if (err) throw err;
        console.log(result);
        con.query(insertProductQuery, [productObject.Name, productObject.Price, productObject.Image, result[0].idcategory],  function (err, result)
        {
            if (err) throw err;
        });
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
    fetchSpecificCategories,
    fetchSpecificCategoriesName,
    insertCategory,
    updateCategory,
    fetchProducts,
    fetchSpecificProducts,
    insertProduct,
    updateProduct
}