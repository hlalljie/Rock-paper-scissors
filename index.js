// Import required packages
const ChatMessage = require('./chatSchema');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const port = 3000; // You can use any port number

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Atlas Connected');
})
.catch(err => {
  console.error('Connection error', err);
});

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Initialize a simple API endpoint for fetching chat history
app.get('/chatHistory', async (req, res) => {
  const messages = await ChatMessage.find();
  res.json(messages);
});


// Handle socket events
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('chat', (data) => {
    console.log('Message received:', data);
    checkAndEmit(data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function checkAndEmit(data){
    const chatMessage = new ChatMessage(data);
    chatMessage.save();
    io.emit('chat', data);
}

// Start the Express server
server.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
