const express = require('express');
const http=require('http');
const socketIo=require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const cors=require('cors');
const {join}=require('path');

// auth code

const {connection}=require('./db');
const facebookRouter = require('./controllers/routes/facebook.route');
const {postRouter} = require("./controllers/routes/post.routes")
const {likeRouter} = require("./controllers/routes/like.routes")
const {userRouter} = require("./controllers/routes/manualLogin.route")
const PORT=process.env.PORT;

app.use(cors())

app.use(express.json());

app.use('/posts', postRouter)
app.use('/like',likeRouter)



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


// aditi's code
app.get('/chat',(req,res)=>{
  res.sendFile(join(__dirname,'../frontend/views/client.html'))
})

io.on('connection',(socket)=>{
  console.log('a user is connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})










server.listen(PORT,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 6420");
    }catch(err){
        console.log(err);
    }
    
})