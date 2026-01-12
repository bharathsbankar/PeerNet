const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    rvceId: {
        type: String,
        required: [true, 'Please add your RVCE ID'],
        unique: true
    },
    department: {
        type: String,
        required: [true, 'Please select a department'],
        enum: ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CV', 'BT', 'CH', 'AS', 'TE', 'IEM']
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'event_poster'],
        default: 'student'
    },
    interests: [{
        type: String,
        enum: ['music', 'sports', 'dance', 'E-games']
    }],
    bio: {
        type: String,
        maxLength: [500, 'Bio cannot be more than 500 characters']
    },
    location: {
        type: String
    },
    showPersonalDetails: {
        type: Boolean,
        default: false
    },
    connectedPeers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
