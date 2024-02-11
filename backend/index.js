// const express = require('express');
// const {connection}=require('./db');

// const cors = require("cors")

// const app = express()
// app.use(cors())
// app.use(express.json());


// app.get('/',(req,res)=>{
//     res.send("This is Home")
// })
     
// app.listen(6420,async()=>{
//     try{
//          await connection
//          console.log("connected to db")
//          console.log("server is running at port 8080");
//     }catch(err){
//         console.log(err);
//     }
    
// })

const express = require('express');
const app = express();
const session = require('express-session');
const {connection}=require('./db');

const facebookRouter = require('./controllers/routes/facebook.route');

const {postRouter} = require("./controllers/routes/post.routes")
const {likeRouter} = require("./controllers/routes/like.routes")


const passport = require('passport');


// const app = express()
app.use(cors())
app.use(express.json());
app.use('/posts', postRouter)
app.use('/like',likeRouter)


// const app = express()
// app.use(cors())
// app.use(express.json());
// app.use('/posts', postRouter)
// app.use('/like',likeRouter)

app.use(express.json())
require('dotenv').config();

app.set('view engine', 'ejs');

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

// app.use('/auth/google', authRouter);
app.use('/auth/facebook', facebookRouter);
// app.use('/auth/github', githubRouter);
// app.use('/protected', protectedRouter);

app.listen(6420,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 6420");
    }catch(err){
        console.log(err);
    }
    
})