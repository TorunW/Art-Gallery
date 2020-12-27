const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Charlee',
  password: 'Hallo',
  port: 5432,
})

/** USERS */

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${response.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
}

/** /USERS */

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
  console.log(picture_type)
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
  pool.query('SELECT * FROM messages ORDER BY msg_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
/**MESSAGE */

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
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,

    getPictures,
    getPicturesByType,
    createPicture,
    deletePicture,
    updatePicture,

    getNavigation,

    createMessage,
    getMessages,
    
    getTableNames
}