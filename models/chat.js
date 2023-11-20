'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
      Chat.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
    }
  }
  Chat.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats'
  });
  return Chat;
};