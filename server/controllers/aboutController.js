var db = require('../database/db');

exports.getAbout = (req, res) => {
  var sql = "select * from about"
  db.all(sql, (err, row) => {
      if (err) {
      res.status(400).json({"error":err.message});
      return;
      }
      res.json(row)
  });
}
  
exports.updateAbout = function(req,res){
    var data = {
        about_text: req.body.about_text,
        profile_img: req.body.profile_img,
    }
    console.log(data);
    db.run(
        `UPDATE about set 
           about_text = COALESCE(?,about_text), 
           profile_img = COALESCE(?,profile_img)
           WHERE about_id = 1`,
        [data.about_text, data.profile_img ],
        function (err, result) {
          console.log(err);
          console.log(result);
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
}
