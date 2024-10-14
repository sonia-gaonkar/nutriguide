//load express module                               
const express=require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
//const session = require('express-session');
const path = require('path');
// Requiring file system to use local files
const fs = require("fs");
const https = require('https');

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");

const app = express();

app.use(cors());

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "evolve",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const allowedExtensions = ['.js', '.ts', '.css', '.scss', '.min.css', '.html', '.jpg', '.jpeg', '.png', '.PNG', '.gif', '.rtl.min.css', '.svg', '.ttf', '.woff', '.wofft', '.woff2', '.less', '.tif', '.ttf', '.ico'];

app.get('*', (req, res, next) => {

  //check if request is for frontend or backend
  if(!req.url.includes('/api/v1/')) {
    if (allowedExtensions.some(ext => req.url.includes(ext))) {
      // remove the forward slash at the end of the path 
      const url = req.url.replace(/\/$/,'');
      res.sendFile(path.join(__dirname, 'app', 'frontend', 'dist', 'angular-server', 'browser', url));
    } else {
      res.sendFile(path.join(__dirname, 'app', 'frontend', 'dist', 'angular-server', 'browser', 'index.html'));
    }

  }else {
    res.sendFile(path.join(__dirname));
  }
});


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/datamanager.routes")(app);


// Creating object of key and certificate
// for SSL
const options = {
  key: fs.readFileSync("./ca.key"),
  cert: fs.readFileSync("./ca.crt"),
};


//assign port number
//set port, listen for requests
const PORT = process.env.PORT || 8888;
 
/* app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}.`);
});  */


https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}); 