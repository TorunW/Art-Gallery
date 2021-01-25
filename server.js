const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const routes = require('./routes/queries');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//Models
var models = require("./models"); 
 
var authRoute = require('./routes/auth.js')(app,passport);

require('./config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

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

app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.post('/login', 
  passport.authenticate(
    'local', 
    {  
      failureRedirect: '/login',
      login: (req, res) => {
        const { user } = req
      
        res.json(user)
      }
    }
  ),
  function(req, res) {
    res.redirect('/admin');
  }
);

app.get(['/','/admin/', '/sculptures', '/paintings', '/contact'], function (req, res) {
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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(process.env.PORT || 80, () => {
  console.log('YO YO YO BIACH');
});

