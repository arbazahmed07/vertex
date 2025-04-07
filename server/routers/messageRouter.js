const express = require("express");
const router = express.Router();

const Message = require("../models/messageModel");

// Get chat history
router.get("/history/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    
    return res.status(200).json({
      messages: messages,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching chat history",
      error: error.message,
      success: false
    });
  }
});

// Get all chats for a user
router.get("/chats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ timestamp: -1 });
    
    // Extract unique chat IDs
    const chatIds = [...new Set(messages.map(msg => msg.chatId))];
    
    // Get the most recent message for each chat
    const chats = [];
    for (const chatId of chatIds) {
      const latestMessage = await Message.findOne({ chatId })
        .sort({ timestamp: -1 });
      
      // Get the other user id
      const otherUserId = latestMessage.senderId === userId 
        ? latestMessage.receiverId 
        : latestMessage.senderId;
      
      chats.push({
        chatId,
        otherUserId,
        latestMessage: latestMessage.message,
        timestamp: latestMessage.timestamp,
        unread: latestMessage.senderId !== userId && !latestMessage.read
      });
    }
    
    return res.status(200).json({
      chats,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching user chats",
      error: error.message,
      success: false
    });
  }
});

// Store new message
router.post("/send", async (req, res) => {
  try {
    const { chatId, senderId, receiverId, message } = req.body;
    
    const newMessage = await Message.create({
      chatId,
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });
    
    return res.status(200).json({
      message: "Message sent successfully",
      data: newMessage,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error sending message",
      error: error.message,
      success: false
    });
  }
});

// Mark messages as read
router.put("/read/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    
    await Message.updateMany(
      { 
        chatId,
        receiverId: userId,
        read: false
      },
      { 
        $set: { read: true } 
      }
    );
    
    return res.status(200).json({
      message: "Messages marked as read",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error marking messages as read",
      error: error.message,
      success: false
    });
  }
});

module.exports = router;
