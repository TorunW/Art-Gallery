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
  
exports.updateAbout = (request, response) => {
    const id = parseInt(request.params.id)
    const { about_text, profile_img, about_id } = request.body
    pool.query(
      'UPDATE about SET about_text = $1, profile_img = $2 WHERE about_id = 1',
      [about_text, profile_img],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Modified with ID: ${id}`)
      }
    )
  }