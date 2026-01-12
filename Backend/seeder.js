const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load Models
const User = require('./models/User');
const Feed = require('./models/Feed');
const Chat = require('./models/Chat');
const ConnectionRequest = require('./models/ConnectionRequest');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rvce-connect');

// Sample Data (Adapted from Frontend dummyData.js)
const users = [
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@rvce.edu.in',
        password: 'password123', // Will be hashed
        rvceId: 'RVCE23CSE042',
        department: 'CSE',
        role: 'student',
        interests: ['music', 'sports', 'E-games'],
        bio: 'Passionate about coding and music. Love playing cricket on weekends!',
        location: 'Bangalore',
        showPersonalDetails: true
    },
    {
        name: 'Priya Sharma',
        email: 'priya@rvce.edu.in',
        password: 'password123',
        rvceId: 'RVCE23ISE028',
        department: 'ISE',
        role: 'student',
        interests: ['music', 'dance'],
        bio: 'Love classical music and bharatanatyam',
        location: 'Bangalore',
        showPersonalDetails: true
    },
    {
        name: 'Arjun Reddy',
        email: 'arjun@rvce.edu.in',
        password: 'password123',
        rvceId: 'RVCE23ECE015',
        department: 'ECE',
        role: 'student',
        interests: ['sports', 'E-games'],
        bio: 'Gaming enthusiast and football player',
        location: 'Bangalore',
        showPersonalDetails: false
    },
    {
        name: 'Dr. Anita Desai',
        email: 'anita.desai@rvce.edu.in',
        password: 'password123',
        rvceId: 'RVCE18CSE001',
        department: 'CSE',
        role: 'staff',
        interests: ['music'],
        bio: 'Professor of Computer Science',
        location: 'Bangalore',
        showPersonalDetails: true
    }
];

const importData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Feed.deleteMany();
        await Chat.deleteMany();
        await ConnectionRequest.deleteMany();

        console.log('Data Destroyed...');

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = await Promise.all(users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        // Insert Users
        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers[0]; // Rajesh

        console.log('Users Imported...');

        // Create Feeds
        // Note: Images are placeholders for now as we don't have the Base64 strings ready in this script
        // In a real scenario, we'd read files and convert to Buffer
        const feeds = [
            {
                title: 'Kaggle Royale - Data Science Competition',
                description: 'Build on Data, Won by Skill. Join us for an intense data science showdown.',
                date: new Date('2025-12-23T08:45:00'),
                location: 'Seminar Hall, Civil Department',
                link: 'https://forms.google.com/kaggleroyale',
                image: {
                    data: Buffer.from('placeholder_image_data'), // Placeholder Buffer
                    contentType: 'image/jpeg'
                },
                postedBy: adminUser._id
            },
            {
                title: 'Cultural Night 2025',
                description: 'Experience the vibrant cultural diversity of RVCE!',
                date: new Date('2025-01-20T18:00:00'),
                location: 'Open Air Theatre, RVCE',
                link: 'https://forms.google.com/culturalnight',
                image: {
                    data: Buffer.from('placeholder_image_data'),
                    contentType: 'image/jpeg'
                },
                postedBy: createdUsers[3]._id // Dr. Anita
            }
        ];

        await Feed.insertMany(feeds);
        console.log('Feeds Imported...');

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Feed.deleteMany();
        await Chat.deleteMany();
        await ConnectionRequest.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
