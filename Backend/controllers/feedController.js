const Feed = require('../models/Feed');
const User = require('../models/User');

// @desc    Get all feeds
// @route   GET /api/feed
// @access  Public (or Private?) - Public for now
const getFeeds = async (req, res) => {
    try {
        const feeds = await Feed.find()
            .populate('postedBy', 'name role department') // Populate user details
            .sort({ date: -1 }); // Sort by event date descending (or createdAt?) - User said "newest first" usually means createdAt or eventDate. Strategy: Show upcoming events?
        // Actually, usually feeds are sorted by CreatedAt (newly posted) or Date (Event date).
        // Let's sort by createdAt desc for the "Feed" feel.

        // Wait, schema has index on "date". Let's use date (Event Date) as per schema.
        // Actually, user might want to see upcoming events. 
        // Let's just return all for now sorted by creation time so freshly posted stuff appears top.
        // Or sort by event date relative to now?
        // Let's stick to standard blog style: Newest POST first.
        const sortedFeeds = await Feed.find().sort({ createdAt: -1 }).populate('postedBy', 'name role department');

        // Transform image buffer to Base64 string for frontend
        const feedsWithImages = sortedFeeds.map(feed => {
            let imageBase64 = '';
            if (feed.image && feed.image.data) {
                imageBase64 = `data:${feed.image.contentType};base64,${feed.image.data.toString('base64')}`;
            }
            return {
                ...feed._doc,
                image: imageBase64 // Replace Buffer with Base64 string
            };
        });

        res.status(200).json(feedsWithImages);
    } catch (error) {
        console.error("Error in getFeeds: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc    Create a new feed post
// @route   POST /api/feed
// @access  Private
const createFeed = async (req, res) => {
    try {
        const { title, description, date, location, link, image, contentType } = req.body;
        // Image expectation: Frontend sends Base64 string directly? 
        // OR Frontend sends JSON with { image: "base64..." } ?
        // User's prompt optimization was: "image: { data: Buffer, contentType: String }" in Schema.
        // So controller needs to convert incoming Base64 -> Buffer.

        if (!title || !description || !date || !location || !link || !image) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Convert Base64 string (data:image/jpeg;base64,...) to Buffer
        // Assume frontend sends full Data URI or just base64?
        // Let's assume Data URI.
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let imageBuffer, imageType;

        if (matches && matches.length === 3) {
            imageType = matches[1];
            imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
            // Fallback if just raw base64 sent
            return res.status(400).json({ message: 'Invalid image format. Use Data URI.' });
        }

        const feed = await Feed.create({
            title,
            description,
            date,
            location,
            link,
            image: {
                data: imageBuffer,
                contentType: imageType
            },
            postedBy: req.user.id
        });

        res.status(201).json(feed);

    } catch (error) {
        console.error("Error in createFeed: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getFeeds,
    createFeed
};
