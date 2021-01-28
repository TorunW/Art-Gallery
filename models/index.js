const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const sequelize = new Sequelize('postgres://'+config.username+':'+config.password+'@'+config.host+':5432/'+config.database+'')
let db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = require(path.join(__dirname, file));
        db[model.name] = model;
    });
  
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;