
const express = require('express');
const {
  sendMessage,
  getMessages,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, sendMessage)
  .get(protect, getMessages);

router.get('/unread', protect, getUnreadCount);
router.get('/:userId', protect, getConversation);
router.put('/read/:senderId', protect, markMessagesAsRead);

module.exports = router;
