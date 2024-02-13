const express = require('express');
const http=require('http');
const socketIo=require('socket.io');
const app = express();
const server = http.createServer(app);

require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const cors=require('cors');
const {join}=require('path');

// auth code

const {connection}=require('./db');
const facebookRouter = require('./controllers/routes/facebook.route');
const googleRouter = require('./controllers/routes/google.route');
const {postRouter} = require("./controllers/routes/post.routes")
const {likeRouter} = require("./controllers/routes/like.routes")
const {userRouter} = require("./controllers/routes/manualLogin.route")
const {commentRouter} = require("./controllers/routes/comment.routes")
const PORT=process.env.PORT;

app.use(cors())

app.use(express.json());

app.use('/posts', postRouter)
app.use('/like',likeRouter)
app.use('/comment',commentRouter);


app.set('view engine', 'ejs');

require('dotenv').config();



app.use('/users', userRouter);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.get('/', (req, res) => {
  res.render('auth');
});

app.use('/auth/facebook', facebookRouter);

app.use('/auth/google', googleRouter);


// aditi's code
app.get('/chat',(req,res)=>{
  res.sendFile(join(__dirname,'../frontend/views/client.html'))
})


const io = require('socket.io')(server, {
  cors: {
      origin: ['http://127.0.0.1:5500','http://localhost:6420'],
      methods: ['GET', 'POST'],
      credentials: true
  },
});


io.on('connection', onConnected);

let socketsConnected = new Set();

function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-mesg', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}










server.listen(PORT,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 6420");
    }catch(err){
        console.log(err);
    }
    
})