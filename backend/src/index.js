import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../routes/auth.routes.js"
import connectToMongoDB from "../db/connectToMongoDb.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
	}, 
});

let rooms = {}; 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  
  socket.on("sendmessage",(data)=>{
     socket.broadcast.emit("getmessage",data);
  })
  socket.on('createRoom', ({roomName,pl_n,profilePic}) => {
    rooms[roomName] = { players: [], board: Array(9).fill(null), currentTurn: 0,player_name:[],profiles: [], };
    socket.join(roomName);
    rooms[roomName].players.push(socket.id);
    rooms[roomName].player_name.push(pl_n);
    rooms[roomName].profiles.push(profilePic);
    socket.emit('roomCreated', {roomName,pl_n,profile_player:rooms[roomName].profiles});
  });

  socket.on("del",({id,roomName})=>{

    const index = rooms[roomName].players.findIndex(playerId => playerId === id);

    if (index !== -1) {
        // Remove the corresponding player details
        rooms[roomName].profiles.splice(index, 1);
        rooms[roomName].players.splice(index, 1);
        rooms[roomName].player_name.splice(index, 1);}
    // (rooms[roomName]).pop()
    io.emit("remove",{profile_player:rooms[roomName].profiles,players:rooms[roomName].players,player_name:rooms[roomName].player_name});
  })

  // Handle joining a room
  socket.on('joinRoom', ({roomName,pl_n,profilePic}) => {
    if (rooms[roomName] && rooms[roomName].players.length < 2) {
      socket.join(roomName);
      rooms[roomName].players.push(socket.id);
      rooms[roomName].player_name.push(pl_n);
      rooms[roomName].profiles.push(profilePic);
      socket.emit('roomJoined', {roomName,pl_n});
      io.to(roomName).emit('startGame', {player_name:rooms[roomName].player_name,player:rooms[roomName].players,profile_player:rooms[roomName].profiles});
    } else {
      socket.emit('roomFull');
    }
  });

  // Handle a move made by a player
  socket.on('makeMove', (data) => {
    const { roomName, index, symbol } = data;
    rooms[roomName].board[index] = symbol;
    io.to(roomName).emit('moveMade', { index, symbol });

    // Check for winner and emit win event if there's a winner
    if (checkWinner(rooms[roomName].board, symbol)) {
        console.log(symbol)
      io.to(roomName).emit('gameOver', symbol);
    } else if (checkDraw(rooms[roomName].board)) {
      io.to(roomName).emit('gameOver', 'draw');
    }
  });

  socket.on('resetGame', ({roomName,profile}) => {
    if (rooms[roomName]) {
      rooms[roomName].board = Array(9).fill(null);
      rooms[roomName].currentTurn = 0;
      io.to(roomName).emit('startGame', { player_name: rooms[roomName].player_name, player: rooms[roomName].players,profile_player:rooms[roomName].profiles });
    }
  });
  

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove player from rooms if they disconnect
    for (let roomName in rooms) {
      if (rooms[roomName].players.includes(socket.id)) {
        rooms[roomName].players = rooms[roomName].players.filter(id => id !== socket.id);
        if (rooms[roomName].players.length === 0) {
          delete rooms[roomName];
        }
        break;
      }
    }
  });
});

// Helper functions to check for winner or draw
function checkWinner(board, symbol) {
  // Winning combinations in Tic Tac Toe
  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  return winningConditions.some((condition) => {
    const [a, b, c] = condition;
    return board[a] === symbol && board[b] === symbol && board[c] === symbol;
  });
}

function checkDraw(board) {
  return board.every((cell) => cell !== null);
}

// Start the server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
