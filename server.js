// Create express app
var express = require('express');
var passport   = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session    = require('express-session');
var path = require('path');
var app = express();
var fileUpload = require('express-fileupload');
var cors = require('cors');

// Body Parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport & session
app.use(session({ secret: 'keyboard cat',resave: false, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// cors
app.use(cors());

// Serve static files
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/uploads'));

// file upload
app.use(fileUpload())

// Root endpoint
app.get(["/","/signin"], (req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// models
var models = require('./server/models/');

// routes
var routes = require('./server/routes/routes.js')(app,passport);

// load passport strategies
require('./server/config/passport/passport.js')(passport, models.user);
 
// sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});
 
app.post('/upload',function(req, res){
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // accessing the file
    const myFile = req.files.file;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/uploads/pictures/${myFile.name}`, function (err) {
        if (err) {
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `pictures/${myFile.name}`});
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

// Server port
var HTTP_PORT = 34296;

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
