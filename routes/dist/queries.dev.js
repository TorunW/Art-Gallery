"use strict";

var Pool = require('pg').Pool;

var pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Charlee',
  password: 'Hallo',
  port: 5432
});
/** USERS */

var getUsers = function getUsers(request, response) {
  pool.query('SELECT * FROM users ORDER BY id ASC', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var getUserById = function getUserById(request, response) {
  var id = parseInt(request.params.id);
  pool.query('SELECT * FROM users WHERE id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var createUser = function createUser(request, response) {
  var _request$body = request.body,
      name = _request$body.name,
      email = _request$body.email;
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(201).send("User added with ID: ".concat(response.insertId));
  });
};

var updateUser = function updateUser(request, response) {
  var id = parseInt(request.params.id);
  var _request$body2 = request.body,
      name = _request$body2.name,
      email = _request$body2.email;
  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("User modified with ID: ".concat(id));
  });
};

var deleteUser = function deleteUser(request, response) {
  var id = parseInt(request.params.id);
  pool.query('DELETE FROM users WHERE id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("User deleted with ID: ".concat(id));
  });
};
/** /USERS */

/** PICTURES */


var getPictures = function getPictures(request, response) {
  pool.query('SELECT * FROM pictures ORDER BY picture_id DESC', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var getPicturesByType = function getPicturesByType(request, response) {
  var picture_type = request.params.picture_type;
  pool.query('SELECT * FROM pictures WHERE picture_type = $1 ORDER BY picture_id DESC', [picture_type], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var createPicture = function createPicture(request, response) {
  var _request$body3 = request.body,
      caption = _request$body3.caption,
      description = _request$body3.description,
      filename = _request$body3.filename,
      price = _request$body3.price,
      picture_type = _request$body3.picture_type;
  pool.query('INSERT INTO pictures (caption, description, filename, price, picture_type ) VALUES ($1, $2, $3, $4, $5 )', [caption, description, filename, price, picture_type], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(201).send("Picture added with ID: ".concat(response.insertId));
  });
};

var deletePicture = function deletePicture(request, response) {
  var id = parseInt(request.params.id);
  pool.query('DELETE FROM pictures WHERE picture_id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("Picture deleted with ID: ".concat(id));
  });
};

var updatePicture = function updatePicture(request, response) {
  var id = parseInt(request.params.id);
  var _request$body4 = request.body,
      caption = _request$body4.caption,
      description = _request$body4.description,
      filename = _request$body4.filename,
      price = _request$body4.price,
      picture_type = _request$body4.picture_type;
  pool.query('UPDATE pictures SET caption = $2, description = $3, filename =$4, price = $5, picture_type = $6 WHERE picture_id = $1', [id, caption, description, filename, price, picture_type], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("Picture modified with ID: ".concat(id));
  });
};
/** PICTURES */

/**NAVIGATION */


var getNavigation = function getNavigation(request, response) {
  pool.query('SELECT * FROM navigation ORDER BY nav_id ASC', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};
/**NAVIGATION */

/**MESSAGES */


var createMessage = function createMessage(request, response) {
  var _request$body5 = request.body,
      name = _request$body5.name,
      email = _request$body5.email,
      msg = _request$body5.msg;
  pool.query('INSERT INTO Messages (name, email, msg ) VALUES ($1, $2, $3 )', [name, email, msg], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(201).send("Message added with ID: ".concat(response.insertId));
  });
};

var getMessages = function getMessages(request, response) {
  pool.query('SELECT * FROM messages ORDER BY msg_id DESC', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var countReadMsg = function countReadMsg(request, response) {
  pool.query('SELECT COUNT(*) FROM messages WHERE read IS NOT true', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var updateMessages = function updateMessages(request, response) {
  var id = parseInt(request.params.id);
  var read = request.body.read;
  pool.query("UPDATE messages SET read = $1 WHERE msg_id = ".concat(id), [read], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("Modified with ID: ".concat(id));
  });
};

var deleteMessage = function deleteMessage(request, response) {
  var id = parseInt(request.params.id);
  pool.query('DELETE FROM messages WHERE msg_id = $1', [id], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("Message deleted with ID: ".concat(id));
  });
};
/**MESSAGE */

/**ABOUT */


var getAbout = function getAbout(request, response) {
  pool.query('SELECT * FROM about', function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

var updateAbout = function updateAbout(request, response) {
  var id = parseInt(request.params.id);
  var _request$body6 = request.body,
      about_text = _request$body6.about_text,
      profile_img = _request$body6.profile_img,
      about_id = _request$body6.about_id;
  pool.query('UPDATE about SET about_text = $1, profile_img = $2 WHERE about_id = 1', [about_text, profile_img], function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).send("Modified with ID: ".concat(id));
  });
};
/**ABOUt */

/**ALL TABLES */


var getTableNames = function getTableNames(request, response) {
  pool.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'", function (error, results) {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};
/**ALL TABLES */


module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getPictures: getPictures,
  getPicturesByType: getPicturesByType,
  createPicture: createPicture,
  deletePicture: deletePicture,
  updatePicture: updatePicture,
  getNavigation: getNavigation,
  createMessage: createMessage,
  getMessages: getMessages,
  countReadMsg: countReadMsg,
  updateMessages: updateMessages,
  deleteMessage: deleteMessage,
  getAbout: getAbout,
  updateAbout: updateAbout,
  getTableNames: getTableNames
};