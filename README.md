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

## Room for Improvement
1) The logos/ pictures can be uploaded on a cloud sever such as Amazon S3, and we can store URL of the server and load the images from there.
2) The UI of the app can be improved significantly. The current UI is made under time constraints and is definitely not the most improved one.
3) A little more time and research is required to implement Redux. Currently, an internal cache is being used to refresh the page every time a change is made. This is definitely not scalable, but works for the scope of this project.
4) The main component of the app is the store page, the app can be broken down in to smaller components.
