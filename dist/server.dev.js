"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var path = require('path');

var db = require('./routes/queries');

var cors = require('cors');

var fileUpload = require('express-fileupload');

var fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"](__dirname + '/build'));
app.use(express["static"](__dirname + '/uploads'));
app.use(fileUpload());
app.get(['/', '/admin/', '/sculptures', '/paintings', '/contact'], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app["delete"]('/users/:id', db.deleteUser);
app.get('/pictures', db.getPictures);
app.get('/pictures/:picture_type', db.getPicturesByType);
app.post('/pictures', db.createPicture);
app["delete"]('/pictures/:id', db.deletePicture);
app.put('/pictures/:id', db.updatePicture);
app.get('/navigation', db.getNavigation);
app.post('/messages', db.createMessage);
app.get('/messages', db.getMessages);
app.get('/countreadmsg', db.countReadMsg);
app.put('/messages/:id', db.updateMessages);
app["delete"]('/messages/:id', db.deleteMessage);
app.get('/about', db.getAbout);
app.put('/about', db.updateAbout);
app.get('/tables', db.getTableNames); // file upload api

app.post('/upload', function (req, res) {
  if (!req.files) {
    return res.status(500).send({
      msg: "file is not found"
    });
  } // accessing the file


  var myFile = req.files.file; //  mv() method places the file inside public directory

  myFile.mv("".concat(__dirname, "/uploads/pictures/").concat(myFile.name), function (err) {
    if (err) {
      return res.status(500).send({
        msg: "Error occured"
      });
    } // returing the response with file path and name


    return res.send({
      name: myFile.name,
      path: "/pictures/".concat(myFile.name)
    });
  });
});
app.post('/delete', function (req, res) {
  try {
    fs.unlinkSync('uploads/' + req.body.path); //file removed

    return res.send({
      msg: 'success'
    });
  } catch (err) {
    console.error(err);
  }
});
var port = process.env.PORT;

if (port == null || port == "") {
  port = 8000;
}

app.listen(process.env.PORT || 80, function () {
  console.log('YO YO YO BIACH');
});