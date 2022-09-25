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
