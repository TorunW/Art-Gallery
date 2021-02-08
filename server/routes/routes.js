var db = require('../database/db');

module.exports = function(app) {
    // Routes
    var pictureRoutes = require('./pictureRoutes.js')(app);
    var messageRoutes = require('./messageRoutes.js')(app);
    var aboutRoutes = require('./aboutRoutes')(app);
    var fileRoutes = require('./fileRoutes')(app);
    var userRoutes = require('./userRoute')(app);

    // Navigation
    app.get('/navigation', (req, res) => {
        var sql = "select * from navigation ORDER BY nav_id DESC"
        var params = [req.params.id]
        db.all(sql, params, (err, row) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.json(row)
        });
    });

    // Tables
    app.get('/tables', (request, response) => {
        pool.query('SELECT * FROM about', (error, results) => {
          if (error) {
            throw error
          }
          response.status(200).json(results.rows)
        }) 
    });
}