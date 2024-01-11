// Import required packages
//const ChatMessage = require('./chatSchema');
const RPSGame = require('./rpsGameSchema');
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

// Handle rps socket events
// handle client joining game, assigns them guest or host
// handle client sending player choice
// handle client leaving game
io.on('connection', (socket) => {
  var clientIp = socket.request.connection.remoteAddress;
  console.log("Hello world, new connection from:", clientIp, "- id", socket.id);
  socket.on('playerConnect', (data) => {
    console.log('Player Connected', data, "- id", socket.id);
    initPlayer(data, socket.id);
  });
  socket.on('rps', (data) => {
    console.log('Message received:', data, "- id", socket.id);
    storeAndEmit(data, socket.id);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected', "- id", socket.id);
  });
});

async function initPlayer(data, sockid){
  if (!await RPSGame.exists({lobbyName: data.lobbyName})){
    let newGame = new RPSGame( {
      lobbyName: data.lobbyName,
      player1: {
        sockid: sockid,
        name: data.username,
        currentChoice: "",
        currentRecord: {
          wins: 0,
          losses: 0,
          ties: 0
        }
      },
      player2: {
        sockid: "",
        name: "",
        currentChoice: "",
        currentRecord: {
          wins: 0,
          losses: 0,
          ties: 0
        }
      }
    });
    await newGame.save();
  }
  else{
    let game = await RPSGame.findOne({lobbyName: data.lobbyName});
    if (game.player2.sockid == ""){
      game.player2 = {
        sockid: sockid,
        name: data.username,
        currentChoice: "",
        currentRecord: {
          wins: 0,
          losses: 0,
          ties: 0
        }
      }
      await game.save();
    }
    else{
      console.log("Game is full");
    }
  }
  //console.log(data, "player connected");
}

async function storeAndEmit(data, sockid){
  let game = await RPSGame.findOne({lobbyName: data.lobbyName});
  // Check whose submission to update and update
  if (sockid == game.player1.sockid){
    game.player1.currentChoice = data.choice;
  }
  else if (sockid == game.player2.sockid){
    game.player2.currentChoice = data.choice;
  }
  // Check if the game has a result
  if (game.player1.currentChoice != "" && game.player2.currentChoice != ""){
    if (game.player1.currentChoice == "rock" && game.player2.currentChoice == "scissors"){
      game.player1.currentRecord.wins += 1;
      game.player2.currentRecord.losses += 1;
      io.emit("result", {winner: game.player1.name});
    }
    else if (game.player1.currentChoice == "rock" && game.player2.currentChoice == "paper"){
      game.player1.currentRecord.losses += 1;
      game.player2.currentRecord.wins += 1;
      io.emit ("result", {winner: game.player2.name});
    }
    else if (game.player1.currentChoice == "scissors" && game.player2.currentChoice == "rock"){
      game.player1.currentRecord.losses += 1;
      game.player2.currentRecord.wins += 1;
      io.emit("result", {winner: game.player2.name});
    }
    else if (game.player1.currentChoice == "scissors" && game.player2.currentChoice == "paper"){
      game.player1.currentRecord.wins += 1;
      game.player2.currentRecord.losses += 1;
      io.emit("result", {winner: game.player1.name});
    }
    else if (game.player1.currentChoice == "paper" && game.player2.currentChoice == "scissors"){
      game.player1.currentRecord.losses += 1;
      game.player2.currentRecord.wins += 1;
      io.emit("result", {winner: game.player2.name});
    }
    else if (game.player1.currentChoice == "paper" && game.player2.currentChoice == "rock"){
      game.player1.currentRecord.wins += 1;
      game.player2.currentRecord.losses += 1;
      io.emit("result", {winner: game.player1.name});
    }
    else{
      game.player1.currentRecord.ties += 1;
      game.player2.currentRecord.ties += 1;
      io.emit("result", {winner: "Tie"});
    }
    game.player1.currentChoice = "";
    game.player2.currentChoice = "";
  }
  await game.save();
   //console.log(data, "ready to be stored");
  // game id, and isHost to store response
  // if both responses are in, emit result

}

// Start the Express server
server.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});