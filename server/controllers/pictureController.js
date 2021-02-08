
var db = require('../database/db');

exports.getPictures = (req, res) => {
    var sql = "SELECT * FROM pictures ORDER BY picture_id DESC"
    var params = [req.params.id]
    db.all(sql, params, (err, row) => {
        if (err) {
        res.status(400).json({"error":err.message});
        return;
        }
        res.json(row)
    });
}

exports.getPicturesByType = (req, res) => {
  var params =  [req.params.picture_type]
  var sql = 'SELECT * FROM pictures WHERE picture_type = ? ORDER BY picture_id DESC';
  db.all(sql, params, (err, row) => {
      if (err) {
      res.status(400).json({"error":err.message});
      return;
      }
      res.json(row)
  });
}

exports.createPicture = (req, res) => {
  const { caption, description, filename, price, picture_type } = req.body
  var sql = 'INSERT INTO pictures (caption, description, filename, price, picture_type ) VALUES (?,?,?,?,?)'
  var params = [caption, description, filename, price, picture_type]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": result,
          "id" : this.lastID
      })
  });
} 

exports.updatePicture = (req, res) => {
  const { caption, description, filename, price, picture_type } = req.body
  db.run(
    `UPDATE pictures SET 
        caption = COALESCE(?,caption),
        description = COALESCE(?,description),
        filename = COALESCE(?,filename),
        price = COALESCE(?,price),
        picture_type = COALESCE(?,picture_type) 
        WHERE picture_id = ?`,
    [ caption, description, filename, price, picture_type, req.params.id],
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({ message: "success" })
    }
  );
}

exports.deletePicture = (req, res) => {
  db.run(
    'DELETE FROM pictures WHERE picture_id = ?',
    req.params.id,
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({"message":"deleted", changes: this.changes})
  });
}