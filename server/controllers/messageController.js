var db = require('../database/db');

exports.createMessage = (req, res) => {
  const { name, email, msg } = req.body
  var sql = 'INSERT INTO messages (name, email, msg ) VALUES (?,?,?)'
  var params =  [name, email, msg ];
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success"
      })
  });
}

exports.getMessages = (req, res) => {
  var sql = 'SELECT * FROM messages ORDER BY msg_id DESC'
  db.all(sql, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json(row)
  });
}

exports.countReadMsg = (req, res) => {
  var sql = 'SELECT COUNT(*) FROM messages WHERE read IS NOT true'
  db.all(sql, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json(row)
  });
}

exports.updateMessages = (request, response) => {
  const id = parseInt(request.params.id)
  const { read } = request.body
  db.run(
    `UPDATE messages SET read = COALESCE(?,read) WHERE msg_id = ?`,
    [read, request.params.id],
    (error, results) => {
      
      if (error) {
        throw error
      }
      response.status(200).send(`Modified with ID: ${id}`)
    }
  )
}

exports.deleteMessage = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM messages WHERE msg_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Message deleted with ID: ${id}`)
  })
}