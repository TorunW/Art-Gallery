
var bCrypt = require('bcrypt');

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;


    passport.serializeUser(function(user, done) {
        console.log(user.id, 'serialize user');
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        console.log(id, "deserialize user");
        User.findByPk(id, function(err, user) {
            console.log("found a user iwht pk fskaj fkasfj asf jksa fajkd")
          done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy(
 
        {
 
            usernameField: 'email',
 
            passwordField: 'password',
 
            passReqToCallback: true // allows us to pass back the entire request to the callback
 
        },
 
 
 
        function(req, email, password, done) {
 
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
 
 
 
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
 
                if (user)
 
                {
 
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
 
                } else
 
                {
 
                    var userPassword = generateHash(password);
 
                    var data =
 
                        {
                            email: email,
 
                            password: userPassword,
 
                            firstname: req.body.firstname,
 
                            lastname: req.body.lastname
 
                        };
 
                    User.create(data).then(function(newUser, created) {
 
                        if (!newUser) {
 
                            return done(null, false);
 
                        }
 
                        if (newUser) {
 
                            return done(null, newUser);
 
                        }
 
                    });
 
                }
 
            });
 
        }
 
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
    
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
    
    
        function(req, email, password, done) {

            var User = user;    
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) { 

                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
    
                //if (!isValidPassword(user.password, password)) {
                if (user.password !== password) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });    
                }

                req.logIn(user, function(err) {
                    var userinfo = user.get();
                    req.session.user = user;
                    req.session.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            return done(null, userinfo);
                        }
                    });
                });

                /*var userinfo = user.get();
                console.log(userinfo, 'userinfo');
                return done(null, userinfo);*/
    
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));

}