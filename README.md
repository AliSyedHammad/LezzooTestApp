## Setting Up the App
First navigate to the repository and then populate the MySQL database by the following commands:
```
$ mysql
mysql> source ./lezzoodbs.sql 
```
Then to run the backend server, navigate to `Lezzoo_Backend` and then run the following commands:
```
npm i
node .\src\api\server.js
```
Now to run the frontend application, navigate to the `lezzoo` and then run the following commands:
```
yarn
yarn start
```

Now open your browser and navigate to the url `localhost:3000/free`. The application will be usable.

## Instructions
- The Main screen lists all the stores
- The 3 icons in the 'Actions' column perform the 'Add Category', 'Add Product', and 'View Store' actions respectively.
  - Press the 'Add Category' button, type a category and add an image in the dialogue box to add a new category to a store.
  - Press the 'Add Product' button, choose a category to add a product to, enter the product price and a price (will only accept a decimal value), and upload an image to add a product to a category in a store. All fields are mandatory.
  - Press the 'View Store' button to view all the categories and the respective products in them. Click on the close at the bottom right of the screen to navigate back to the home screen.

## Room for Improvement
1) The logos/ pictures can be uploaded on a cloud sever such as Amazon S3, and we can store URL of the server and load the images from there.
2) The UI of the app can be improved significantly. The current UI is made under time constraints and is definitely not the most improved one.
3) A little more time and research is required to implement Redux. Currently, an internal cache is being used to refresh the page every time a change is made. This is definitely not scalable, but works for the scope of this project.
4) The main component of the app is the store page, the app can be broken down in to smaller components.
