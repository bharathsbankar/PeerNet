// Dummy user data
export const currentUser = {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@rvce.edu.in',
    rvceId: 'RVCE23CSE042',
    department: 'CSE',
    role: 'student',
    interests: ['music', 'sports', 'E-games'],
    bio: 'Passionate about coding and music. Love playing cricket on weekends!',
    location: 'Bangalore',
    showPersonalDetails: true,
    connectedPeers: ['2', '3', '5']
};

// Dummy users for Connect page
export const dummyUsers = [
    {
        _id: '2',
        name: 'Priya Sharma',
        email: 'priya@rvce.edu.in',
        rvceId: 'RVCE23ISE028',
        department: 'ISE',
        role: 'student',
        interests: ['music', 'dance'],
        bio: 'Love classical music and bharatanatyam',
        location: 'Bangalore',
        showPersonalDetails: true,
        connectedPeers: ['1', '4']
    },
    {
        _id: '3',
        name: 'Arjun Reddy',
        email: 'arjun@rvce.edu.in',
        rvceId: 'RVCE23ECE015',
        department: 'ECE',
        role: 'student',
        interests: ['sports', 'E-games'],
        bio: 'Gaming enthusiast and football player',
        location: 'Bangalore',
        showPersonalDetails: false,
        connectedPeers: ['1', '6']
    },
    {
        _id: '4',
        name: 'Dr. Anita Desai',
        email: 'anita.desai@rvce.edu.in',
        rvceId: 'RVCE18CSE001',
        department: 'CSE',
        role: 'staff',
        interests: ['music'],
        bio: 'Professor of Computer Science',
        location: 'Bangalore',
        showPersonalDetails: true,
        connectedPeers: ['2']
    },
    {
        _id: '5',
        name: 'Sneha Patel',
        email: 'sneha@rvce.edu.in',
        rvceId: 'RVCE23CSE089',
        department: 'CSE',
        role: 'student',
        interests: ['music', 'sports'],
        bio: 'Music lover and badminton player',
        location: 'Bangalore',
        showPersonalDetails: true,
        connectedPeers: ['1']
    },
    {
        _id: '6',
        name: 'Karthik Rao',
        email: 'karthik@rvce.edu.in',
        rvceId: 'RVCE23ME034',
        department: 'ME',
        role: 'student',
        interests: ['E-games', 'sports'],
        bio: 'Esports player and tech enthusiast',
        location: 'Bangalore',
        showPersonalDetails: true,
        connectedPeers: ['3']
    }
];

// Dummy feed posts
export const dummyFeeds = [
    {
        _id: 'f1',
        title: 'Kaggle Royale - Data Science Competition',
        description: 'Build on Data, Won by Skill. Join us for an intense data science showdown presented by RV College of Engineering. \n\nAgenda:\n• Team Registration: 8:45 AM\n• Chit Fun: 9:00 AM\n• Git x Kaggle: 9:30 AM\n• Competition: 10:00 AM',
        date: new Date('2025-12-23T08:45:00'),
        location: 'Seminar Hall, Civil Department',
        link: 'https://forms.google.com/kaggleroyale',
        image: '/poster-demo.jpg', // Local image from user
        postedBy: {
            _id: '7',
            name: 'Rohith Arsha',
            role: 'event_poster'
        },
        createdAt: new Date('2024-12-20T09:00:00')
    },
    {
        _id: 'f2',
        title: 'Cultural Night 2025',
        description: 'Experience the vibrant cultural diversity of RVCE! Dance, music, drama, and much more. Come witness the best talent of our college.',
        date: new Date('2025-01-20T18:00:00'),
        location: 'Open Air Theatre, RVCE',
        link: 'https://forms.google.com/culturalnight',
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=600&q=80', // Vertical concert image
        postedBy: {
            _id: '8',
            name: 'Cultural Committee',
            role: 'event_poster'
        },
        createdAt: new Date('2024-12-18T14:30:00')
    },
    {
        _id: 'f3',
        title: 'Hackathon 2025 - Code for Change',
        description: '24-hour coding marathon! Build innovative solutions for real-world problems. Amazing prizes to be won! Themes: AI, Blockchain, IoT.',
        date: new Date('2025-02-05T09:00:00'),
        location: 'CS Department, RVCE',
        link: 'https://forms.google.com/hackathon2025',
        image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=600&q=80', // Vertical code image
        postedBy: {
            _id: '7',
            name: 'Tech Club RVCE',
            role: 'event_poster'
        },
        createdAt: new Date('2024-12-22T11:00:00')
    },
    {
        _id: 'f4',
        title: 'Sports Day 2025',
        description: 'Annual inter-department sports competition. Cricket, football, basketball, and more! Register your teams now.',
        date: new Date('2025-01-28T07:00:00'),
        location: 'Sports Complex, RVCE',
        link: 'https://forms.google.com/sportsday',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', // Vertical sports image
        postedBy: {
            _id: '9',
            name: 'Sports Committee',
            role: 'event_poster'
        },
        createdAt: new Date('2024-12-19T16:00:00')
    }
];

// Dummy connection requests
export const dummyConnectionRequests = [
    {
        _id: 'cr1',
        sender: {
            _id: '10',
            name: 'Vikram Singh',
            department: 'EEE',
            role: 'student'
        },
        receiver: '1',
        status: 'pending'
    },
    {
        _id: 'cr2',
        sender: {
            _id: '11',
            name: 'Meera Nair',
            department: 'CSE',
            role: 'student'
        },
        receiver: '1',
        status: 'pending'
    }
];

// Dummy chat conversations
export const dummyChats = [
    {
        _id: 'chat1',
        participants: ['1', '2'],
        otherUser: {
            _id: '2',
            name: 'Priya Sharma',
            department: 'ISE'
        },
        messages: [
            {
                sender: '2',
                content: 'Hey! Are you coming to the TechFest?',
                timestamp: new Date('2024-12-23T10:30:00')
            },
            {
                sender: '1',
                content: 'Yes! Already registered. You?',
                timestamp: new Date('2024-12-23T10:32:00')
            },
            {
                sender: '2',
                content: 'Same here! Let\'s meet there 😊',
                timestamp: new Date('2024-12-23T10:33:00')
            }
        ]
    },
    {
        _id: 'chat2',
        participants: ['1', '3'],
        otherUser: {
            _id: '3',
            name: 'Arjun Reddy',
            department: 'ECE'
        },
        messages: [
            {
                sender: '3',
                content: 'Dude, wanna play Valorant tonight?',
                timestamp: new Date('2024-12-23T15:00:00')
            },
            {
                sender: '1',
                content: 'Sure! 9 PM?',
                timestamp: new Date('2024-12-23T15:05:00')
            }
        ]
    },
    {
        _id: 'chat3',
        participants: ['1', '5'],
        otherUser: {
            _id: '5',
            name: 'Sneha Patel',
            department: 'CSE'
        },
        messages: [
            {
                sender: '5',
                content: 'Hi! Can you share the DSA notes?',
                timestamp: new Date('2024-12-22T14:20:00')
            },
            {
                sender: '1',
                content: 'Sure, I\'ll send them by evening',
                timestamp: new Date('2024-12-22T14:25:00')
            },
            {
                sender: '1',
                content: 'Sent to your email!',
                timestamp: new Date('2024-12-22T18:00:00')
            }
        ]
    }
];

// Department options
export const departments = [
    'CSE',
    'ISE',
    'ECE',
    'EEE',
    'ME',
    'CV',
    'BT',
    'CH',
    'AS',
    'TE',
    'IEM'
];

// Interest options
export const interests = [
    'music',
    'sports',
    'dance',
    'E-games'
];
