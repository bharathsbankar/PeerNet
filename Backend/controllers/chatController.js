const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Get all chats for current user
// @route   GET /api/chat
// @access  Private
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user.id
        })
            .populate('participants', 'name department') // Basic info for list
            .populate('messages.sender', 'name')
            .sort({ lastUpdated: -1 });

        // Transform to match frontend expected structure
        // Frontend expects: { _id, participants, otherUser: {name, dept}, messages: [] }
        // We need to identify "otherUser" manually
        const formattedChats = chats.map(chat => {
            const otherUser = chat.participants.find(p => p._id.toString() !== req.user.id.toString());
            return {
                _id: chat._id,
                participants: chat.participants.map(p => p._id),
                otherUser: otherUser ? {
                    _id: otherUser._id,
                    name: otherUser.name,
                    department: otherUser.department
                } : { name: 'Unknown User' }, // Fallback
                messages: chat.messages,
                lastUpdated: chat.lastUpdated
            };
        });

        res.status(200).json(formattedChats);
    } catch (error) {
        console.error("Error in getChats: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Get or Create a chat with a specific user
// @route   POST /api/chat/access
// @access  Private
const accessChat = async (req, res) => {
    const { userId } = req.body; // The other user's ID

    if (!userId) {
        return res.status(400).json({ message: 'UserId param not sent with request' });
    }

    try {
        // Check if chat exists
        var isChat = await Chat.find({
            participants: { $all: [req.user.id, userId] }
        })
            .populate('participants', 'name department')
            .populate("messages.sender", "name");

        if (isChat.length > 0) {
            // Chat exists, return it (formatted)
            const chat = isChat[0];
            const otherUser = chat.participants.find(p => p._id.toString() !== req.user.id.toString());
            res.send({
                _id: chat._id,
                participants: chat.participants.map(p => p._id),
                otherUser: otherUser ? {
                    _id: otherUser._id,
                    name: otherUser.name,
                    department: otherUser.department
                } : { name: 'Unknown' },
                messages: chat.messages,
                lastUpdated: chat.lastUpdated
            });
        } else {
            // Create new chat
            var chatData = {
                participants: [req.user.id, userId],
                messages: []
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "participants",
                "name department"
            );

            const otherUser = fullChat.participants.find(p => p._id.toString() !== req.user.id.toString());
            res.status(200).json({
                _id: fullChat._id,
                participants: fullChat.participants.map(p => p._id),
                otherUser: otherUser ? {
                    _id: otherUser._id,
                    name: otherUser.name,
                    department: otherUser.department
                } : { name: 'Unknown' },
                messages: fullChat.messages,
                lastUpdated: fullChat.lastUpdated
            });
        }
    } catch (error) {
        console.error("Error in accessChat: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Send Message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        return res.status(400).json({ message: 'Invalid data passed into request' });
    }

    try {
        // Push message to array
        const newMessage = {
            sender: req.user.id,
            content: content,
            timestamp: new Date()
        };

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: newMessage },
                lastUpdated: new Date()
            },
            { new: true }
        )
            .populate("participants", "name department")
            .populate("messages.sender", "name");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const otherUser = updatedChat.participants.find(p => p._id.toString() !== req.user.id.toString());

        const fullChat = {
            _id: updatedChat._id,
            participants: updatedChat.participants.map(p => p._id),
            otherUser: otherUser ? {
                _id: otherUser._id,
                name: otherUser.name,
                department: otherUser.department
            } : { name: 'Unknown' },
            messages: updatedChat.messages,
            lastUpdated: updatedChat.lastUpdated
        };

        res.json(fullChat);
    } catch (error) {
        console.error("Error in sendMessage: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getChats,
    accessChat,
    sendMessage
};
