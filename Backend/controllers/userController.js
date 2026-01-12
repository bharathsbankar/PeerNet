const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');

// @desc    Get recommendations (users not connected)
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        // Exclude: Self, Already Connected
        const excludedIds = [currentUser._id, ...currentUser.connectedPeers];

        // Find users NOT in excluded list
        // Strategy: Just fetch all (limit 50) and sort by matching interests/dept?
        // Or filter in DB?
        // Let's filter in DB for scale.

        const candidates = await User.find({
            _id: { $nin: excludedIds }
        }).select('-password');

        // Scoring Logic (Client side logic moved here)
        const scoredCandidates = candidates.map(candidate => {
            let score = 0;
            // Same Dept
            if (candidate.department === currentUser.department) score += 5;
            // Same Location
            if (candidate.location === currentUser.location) score += 3;
            // Common Interests
            const commonInterests = candidate.interests.filter(i => currentUser.interests.includes(i));
            score += (commonInterests.length * 2);

            return { ...candidate._doc, score };
        });

        // Sort by score desc
        scoredCandidates.sort((a, b) => b.score - a.score);

        res.status(200).json(scoredCandidates);
    } catch (error) {
        console.error("Error in getRecommendations: ", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Connected Peers
// @route   GET /api/users/connections
// @access  Private
const getConnections = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('connectedPeers', '-password');
        res.status(200).json(user.connectedPeers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Pending Requests
// @route   GET /api/users/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            receiver: req.user.id,
            status: 'pending'
        }).populate('sender', 'name department role rvceId');

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send Connection Request
// @route   POST /api/users/request/:userId
// @access  Private
const sendRequest = async (req, res) => {
    try {
        const receiverId = req.params.userId;
        const senderId = req.user.id;

        if (receiverId === senderId) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        // Check if already connected
        const senderCalls = await User.findById(senderId);
        if (senderCalls.connectedPeers.includes(receiverId)) {
            return res.status(400).json({ message: "Already connected" });
        }

        // Check if request already exists
        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            receiver: receiverId // Any status? Usually just pending. Re-sending rejected request?
        });

        if (existingRequest && existingRequest.status === 'pending') {
            return res.status(400).json({ message: "Request already sent" });
        }

        const newRequest = await ConnectionRequest.create({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        res.status(201).json(newRequest);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Accept Request
// @route   PUT /api/users/request/:requestId/accept
// @access  Private
const acceptRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const request = await ConnectionRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Use user.id (string) vs Object Id comparison
        if (request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already handled' });
        }

        // Update status
        request.status = 'accepted';
        await request.save();

        // Update Users connections
        const sender = await User.findById(request.sender);
        const receiver = await User.findById(request.receiver);

        sender.connectedPeers.push(receiver._id);
        receiver.connectedPeers.push(sender._id);

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Request accepted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject Request
// @route   PUT /api/users/request/:requestId/reject
// @access  Private
const rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const request = await ConnectionRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update status or delete? 
        // Let's delete it so they can request again later? Or keep as rejected history.
        // Keeping as rejected.
        request.status = 'rejected';
        await request.save();

        res.status(200).json({ message: 'Request rejected' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getRecommendations,
    getConnections,
    getRequests,
    sendRequest,
    acceptRequest,
    rejectRequest
};
