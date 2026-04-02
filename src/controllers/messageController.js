/** @format */
import Message from "../models/Message.js";

// @desc    Get all messages for a specific chat
// @route   GET /api/messages/:chatId
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch messages" });
  }
};

// @desc    Save a new message to DB
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  const { content, chatId, receiverId } = req.body;

  if (!content || !chatId || !receiverId) {
    return res.status(400).json({ message: "Missing required message fields" });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id, // Set by protect middleware
      receiver: receiverId,
      content,
      chatId,
    });

    const fullMessage = await newMessage.populate("sender", "name avatar");
    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};