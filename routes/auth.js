var authController = require('../controllers/authcontroller.js');
 
 
module.exports = function(app, passport) {
 
    app.get('/signup', authController.signup);
 
 
    app.get('/signin', authController.signin);
 
 
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/admin',
 
            failureRedirect: '/'
        }
 
    ));
 
    app.get('/logout',authController.logout)

    function isLoggedIn(req, res, next) {
 
        if (req.isAuthenticated())
         
            return next();
             
        res.redirect('/signin');
     
    }

    app.get('/admin', isLoggedIn, authController.admin);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/admin',
 
        failureRedirect: '/signin'
    }
 
));

}
