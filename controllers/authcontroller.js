const path = require('path');
var exports = module.exports = {}
 
exports.signup = function(req, res) {
    res.redirect('/admin');
}

exports.signin = function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}

exports.admin = function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}