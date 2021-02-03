/* imports */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var fs = require('fs');

/* /imports */

/* setup */

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/uploads'));

app.use(fileUpload());

/* /setup */

/* routes - should be moved to routes & controllers */

var routes = require('./server/routes/queries');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/pictures', routes.getPictures)
app.get('/pictures/:picture_type', routes.getPicturesByType)
app.post('/pictures', routes.createPicture)
app.delete('/pictures/:id', routes.deletePicture)
app.put('/pictures/:id', routes.updatePicture)

app.get('/navigation', routes.getNavigation)

app.post('/messages', routes.createMessage)
app.get('/messages', routes.getMessages)
app.get('/countreadmsg', routes.countReadMsg)
app.put('/messages/:id', routes.updateMessages)
app.delete('/messages/:id', routes.deleteMessage)

app.get('/about', routes.getAbout)
app.put('/about', routes.updateAbout)

app.get('/tables', routes.getTableNames)

// file upload api
app.post('/upload', (req, res) => {
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
      return res.send({name: myFile.name, path: `/pictures/${myFile.name}`});
  });
})

app.post('/delete', (req, res) => {
  try {
    fs.unlinkSync('uploads/' +req.body.path)
    //file removed
    return res.send({msg:'success'});
  } catch(err) {
    console.error(err)
  }
})

/* / routes - should be moved to routes & controllers */

let PORT = process.env.PORT;
if (PORT == null || PORT == "") PORT = 34296;

app.listen(PORT, () => {
  console.log('YO YO YO BIACH');
  console.log(`Server is listening on port ${PORT}`);
});

//Models

/*var models = require("./models");

var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

//Sync Database
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});
require('./config/passport/passport.js')(passport, models.User);
app.use(cookieParser("schlombaps")); //i let this blank
app.use(session({
  secret: 'schlombaps',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var authRoute = require('./routes/auth.js')(app,passport);*/