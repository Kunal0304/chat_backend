'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Chat, { as: 'sentMessages', foreignKey: 'senderId' });
      User.hasMany(models.Chat, { as: 'receivedMessages', foreignKey: 'receiverId' });

    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    pic: {
      type: DataTypes.STRING,
      defaultValue: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mobile: {
      type: DataTypes.STRING, // Change the data type based on your requirements
    },
    gender: {
      type: DataTypes.STRING, // Change the data type based on your requirements
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};


