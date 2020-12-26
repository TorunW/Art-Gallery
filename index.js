const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const db = require('./server/queries');
const cors = require('cors');
const fileUpload = require('express-fileupload');


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


app.get(['/','/admin/', '/sculptures', '/paintings', '/contact'], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)  
app.delete('/users/:id', db.deleteUser)

app.get('/pictures', db.getPictures)
app.get('/pictures/:picture_type', db.getPicturesByType)
app.post('/pictures', db.createPicture)


app.get('/navigation', db.getNavigation)

app.post('/messages', db.createMessage)
app.get('/messages', db.getMessages)

app.get('/tables', db.getTableNames)

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
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({name: myFile.name, path: `/pictures/${myFile.name}`});
  });
})

app.listen(process.env.PORT || 8080, () => {
  console.log('YO YO YO BIACH');
});

