const { Chat, User } = require('../models');
const { Op } = require('sequelize');

exports.getChatList = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chatSenders = await Chat.findAll({
            where: { receiverId: userId },
            attributes: ['senderId'],
            group: ['senderId'],
          });
          
          const chatReceivers = await Chat.findAll({
            where: { senderId: userId },
            attributes: ['receiverId'],
            group: ['receiverId'],
          });
          
          const senderIds = chatSenders.map(chat => chat.senderId);
          const receiverIds = chatReceivers.map(chat => chat.receiverId);
          
          const users = await User.findAll({
            where: {
              id: {
                [Op.or]: [
                  { [Op.in]: senderIds },
                  { [Op.in]: receiverIds },
                ],
              },
            },
            attributes: ['id', 'name', 'email', 'pic'],
          });
          
    
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
  };

exports.accessChat = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      res.status(400).json({ error: 'UserId param not sent with request' });
    }
  
    try {
      // Check if chat exists
      const isChat = await Chat.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { senderId: req.user.id },
                { receiverId: userId },
              ],
            },
            {
              [Op.and]: [
                { senderId: userId },
                { receiverId: req.user.id },
              ],
            },
          ],
        },
      });
  
      if (isChat) {
        res.json(isChat);
      } else {
        // Create a new chat
        const chatData = {
          senderId: req.user.id,
          receiverId: userId,
          message: 'Start of the conversation',
        };
  
        const createdChat = await Chat.create(chatData);
  
        res.status(200).json(createdChat);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getSingleChats = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
  
      const chats = await Chat.findAll({
        include: [
          { model: User, as: 'sender' },
          { model: User, as: 'receiver' },
        ],
        where: {
          [Op.or]: [
            {
              senderId,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: senderId,
            },
          ],
        },
      });
  
      res.status(200).json(chats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.findAll();
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = await Chat.create({
      senderId,
      receiverId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };