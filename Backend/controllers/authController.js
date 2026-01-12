const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, rvceId, department, role, interests, bio, location, showPersonalDetails } = req.body;

        if (!name || !email || !password || !rvceId || !department) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const rvceIdExists = await User.findOne({ rvceId });
        if (rvceIdExists) {
            return res.status(400).json({ message: 'User with this RVCE ID already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            rvceId,
            department,
            role: role || 'student',
            interests: interests || [],
            bio: bio || '',
            location: location || '',
            showPersonalDetails: showPersonalDetails || false
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                rvceId: user.rvceId,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error("Error in registerUser: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                rvceId: user.rvceId,
                department: user.department,
                role: user.role,
                interests: user.interests,
                avatar: user.name.charAt(0), // Derived avatar
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Error in loginUser: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        // req.user is set in authMiddleware by checking token
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getMe: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
