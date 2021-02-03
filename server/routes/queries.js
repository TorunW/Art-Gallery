const Pool = require('pg').Pool;
const path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

const pool = new Pool({
  user: config.username,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

/** PICTURES */
const getPictures = (request, response) => {
    pool.query('SELECT * FROM pictures ORDER BY picture_id DESC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getPicturesByType = (request, response) => {
  const picture_type = request.params.picture_type
  pool.query('SELECT * FROM pictures WHERE picture_type = $1 ORDER BY picture_id DESC', [picture_type], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  }) 
}

const createPicture = (request, response) => {
  const { caption, description, filename, price, picture_type } = request.body
  pool.query('INSERT INTO pictures (caption, description, filename, price, picture_type ) VALUES ($1, $2, $3, $4, $5 )', [caption, description, filename, price, picture_type], (error, results) => {
    if (error) {
      throw error   
    }
    response.status(201).send(`Picture added with ID: ${response.insertId}`)
  })
} 

const deletePicture = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM pictures WHERE picture_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Picture deleted with ID: ${id}`)
  })
}

const updatePicture = (request, response) => {
  const id = parseInt(request.params.id)
  const { caption, description, filename, price, picture_type } = request.body
  pool.query(
    'UPDATE pictures SET caption = $2, description = $3, filename =$4, price = $5, picture_type = $6 WHERE picture_id = $1',
    [id, caption, description, filename, price, picture_type],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Picture modified with ID: ${id}`)
    }
  )
}

/** PICTURES */

/**NAVIGATION */
const getNavigation = (request, response) => {
    pool.query('SELECT * FROM navigation ORDER BY nav_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}
/**NAVIGATION */

/**MESSAGES */
const createMessage = (request, response) => {
    const { name, email, msg } = request.body
    pool.query('INSERT INTO Messages (name, email, msg ) VALUES ($1, $2, $3 )', [name, email, msg ], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Message added with ID: ${response.insertId}`)
    })
}

const getMessages = (request, response) => {
  pool.query('SELECT * FROM messages ORDER BY msg_id DESC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const countReadMsg = (request, response) => {
  pool.query('SELECT COUNT(*) FROM messages WHERE read IS NOT true', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateMessages = (request, response) => {
  const id = parseInt(request.params.id)
  const { read } = request.body
  pool.query(
    `UPDATE messages SET read = $1 WHERE msg_id = ${id}`,
    [read],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Modified with ID: ${id}`)
    }
  )
}

const deleteMessage = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM messages WHERE msg_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Message deleted with ID: ${id}`)
  })
}
/**MESSAGE */

/**ABOUT */
const getAbout = (request, response) => {
  pool.query('SELECT * FROM about', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  }) 
}


const updateAbout = (request, response) => {
  const id = parseInt(request.params.id)
  const { about_text, profile_img, about_id } = request.body
  pool.query(
    'UPDATE about SET about_text = $1, profile_img = $2 WHERE about_id = 1',
    [about_text, profile_img],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Modified with ID: ${id}`)
    }
  )
}
/**ABOUt */

/**ALL TABLES */
const getTableNames = (request, response) => {
  pool.query("SELECT * FROM information_schema.tables WHERE table_schema = 'public'", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
/**ALL TABLES */

module.exports = {
    getPictures,
    getPicturesByType,
    createPicture,
    deletePicture,
    updatePicture,

    getNavigation,

    createMessage,
    getMessages,
    countReadMsg,
    updateMessages,
    deleteMessage,

    getAbout,
    updateAbout,
    
    getTableNames
}