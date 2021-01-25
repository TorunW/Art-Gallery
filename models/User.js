const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Charlee', 'postgres', 'Hallo', {
    host: 'localhost',
    dialect: 'postgres'
});

const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
  
// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true