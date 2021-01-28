/*

  const { Sequelize, DataTypes } = require('sequelize');

  const sequelize = new Sequelize('Charlee', 'postgres', 'Hallo', {
      host: 'localhost',
      dialect: 'postgres'
  });

  const User = sequelize.define('User', {
      // Model attributes are defined here
      email: {
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
  // console.log(User === sequelize.models.User); // true

  module.exports = User;

*/

module.exports = function(sequelize, Sequelize) {

  var User = sequelize.define('User', {
      id: {
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
      },
      email: {
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

  return User;

}