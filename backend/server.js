// backend/index.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const {connection}=require('./db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set up MongoDB connection


// ... Other middleware and configuration ...

// Add WebSockets for video calling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('offer', (data) => {
    io.to(data.room).emit('offer', data.offer);
  });

  socket.on('answer', (data) => {
    io.to(data.room).emit('answer', data.answer);
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.room).emit('ice-candidate', data.candidate);
  });
});

// ... Your existing routes and middleware ...


server.listen(3000,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 3000");
    }catch(err){
        console.log(err);
    }
    
})
