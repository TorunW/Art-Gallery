var fs = require('fs');

exports.uploadFile = function(req, res){
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
}

exports.deleteFile = function(req, res){
    try {
      fs.unlinkSync('uploads/' +req.body.path)
      //file removed
      return res.send({msg:'success'});
    } catch(err) {
      console.error(err);
      return res.send({msg:'something went wrong'});
    }
}