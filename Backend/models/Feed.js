const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add an event date']
    },
    location: {
        type: String,
        required: [true, 'Please add an event location']
    },
    link: {
        type: String,
        required: [true, 'Please add a registration/info link']
    },
    image: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for sorting feeds by date (Newest first)
feedSchema.index({ date: -1 });

module.exports = mongoose.model('Feed', feedSchema);
