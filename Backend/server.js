const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database


const http = require('http'); // Import http

const app = express();
const server = http.createServer(app); // Create server synchronously

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for Base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
    res.send('RVCE Connect API is running...');
});

const PORT = process.env.PORT;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("server started on port:", PORT);
    });
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User joined room:", userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Chat: " + room);
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved;

        if (!chat.otherUser) return console.log("chat.otherUser not defined");

        // Emit to the other user
        // We know the other user's ID from chat.otherUser._id
        // In this app structure, we might need adjustments depending on what 'newMessageRecieved' contains
        // But assuming we send the full chat object or message object with context

        // Actually, for simple 1-on-1:
        // The room is usually the Chat ID.
        // So we broadcast to the Chat ID room, EXCEPT the sender.
        // socket.in(chat._id).emit("message received", newMessageRecieved);

        // BETTER APPROACH for 1-on-1 private:
        // Emit to the *specific user's* personal room.

        socket.in(chat.otherUser._id).emit("message received", newMessageRecieved);
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
