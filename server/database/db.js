var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        
        console.log('Connected to the SQLite database.')

        // Users
        db.run(
            `CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                email text UNIQUE, 
                order INTEGER,
                password text, 
                CONSTRAINT email_unique UNIQUE (email)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('User table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user","user@example.com",md5("user123456")])
            }
        });  
        
        // Navigation
        db.run(
            `CREATE TABLE navigation (
                nav_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nav_link text, 
                title text,
                display_name text,
                CONSTRAINT nav_id_unique UNIQUE (nav_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Navigation table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO navigation (nav_link, title, display_name) VALUES (?,?,?)'
                db.run(insert, ["paintings","paintings","Tavlor"]);
                db.run(insert, ["sculptures","sculptures","Skulpturer"]);
                db.run(insert, ["about","about","Om mig"]);
                db.run(insert, ["contact","contact","Kontakt"]);
                db.run(insert, ["","home","home"]);
            }
        }); 

        // Pictures
        db.run(
            `CREATE TABLE pictures (
                picture_id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename text UNIQUE, 
                picture_type text, 
                price text,
                caption text,
                description text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT picture_id_unique UNIQUE (picture_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Pictures table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO pictures (filename, picture_type, price, caption, description) VALUES (?,?,?,?,?)'
                db.run(insert, ["img/pictures/1.jpg","paintings","200kr","Sunset","Oil on canvas"]);
            }
        });  
        
        // Messages
        db.run(
            `CREATE TABLE messages (
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                email text, 
                msg text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                read BOOLEAN,
                CONSTRAINT msg_id_unique UNIQUE (msg_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Messages table already created');
            } else {
                // Table just created, creating some rows
                console.log('Messages table created')
            }
        });

        db.run(
            `CREATE TABLE about (
                about_id INTEGER PRIMARY KEY AUTOINCREMENT,
                about_text text, 
                profile_img text, 
                CONSTRAINT about_id_unique UNIQUE (about_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('About table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO about (about_text, profile_img) VALUES (?,?)'
                db.run(insert, ["about text","/pictures/profilenew.jpg"]);
            }
        });
    }
});

module.exports = db

