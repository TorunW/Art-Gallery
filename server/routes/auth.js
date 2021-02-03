var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/logout',authController.logout);
    

    app.post('/signin', function (req, res, next) {
        console.log(req.body);
        passport.authenticate('local-signin', {
          successRedirect: '/admin',
          failureRedirect: '/signin',
        })(req, res, next);  // <-- NEED TO INVOKE WITH req, res, next
    });

    function isLoggedIn(req, res, next) {
        /*console.log(req.session);
        console.log(req.user);
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) return next();
        res.redirect('/signin');*/
        return next();
    }

    app.get('/admin', isLoggedIn, authController.admin);
}
