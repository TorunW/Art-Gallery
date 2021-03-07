var db = require('../database/db');
var path = require('path');
const { url } = require('inspector');

module.exports = function(app,passport) {

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

    // Login
    app.post('/signin', function(req, res, next) {
      console.log("inside of the login",req.sessionID)
      // passport.authenticate with local parameter will call function that configured in passport.use(new strategyCalss)
      passport.authenticate('local-signin', function(err, user, info) {
        console.log('Inside passport.authenticate() callback');
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }
        //req.login calls passport.serialize user
        req.login(user, function(err) {
          console.log('Inside req.login() callback')
          console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
          console.log(`req.user: ${JSON.stringify(req.user)}`)
          if (err) { return next(err); }
          return res.redirect('/admin');
        });
      })(req, res, next);
    });

    // IsLoggedIn
    function isLoggedIn(req, res, next) {
      console.log('isLoggedn')
      console.log(req.isAuthenticated());
        if (req.isAuthenticated())
        return next();
        res.redirect('/signin');
    }

    // Get Admin
    app.get('/admin',isLoggedIn, (req, res) => {
      res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
}