
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // Check if receiver exists
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      res.status(400);
      throw new Error('Receiver not found');
    }

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      content,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages where current user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    // Get messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:senderId
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const senderId = req.params.senderId;

    // Find all unread messages from sender to current user
    const updatedMessages = await Message.updateMany(
      {
        senderId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({ success: true, updatedCount: updatedMessages.nModified });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count unread messages where current user is the receiver
    const count = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
};
