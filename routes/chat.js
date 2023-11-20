const express = require('express');
const router = express.Router();
const ChatController = require('../apis/ChatController');

router.get('/chat', ChatController.getChats);
router.get('/chat/user/:userId', ChatController.getChatList);
router.get('/chat/:senderId/:receiverId', ChatController.getSingleChats);
router.post('/chat', ChatController.accessChat);
router.post('/send-message', ChatController.sendMessage);

module.exports = router;