// const express = require('express');
// const app = express();
// const session = require('express-session');
// const {connection}=require('./db');
// const facebookRouter = require('./controllers/routes/facebook.route');

// const passport = require('passport');


// require('dotenv').config();

// app.set('view engine', 'ejs');



// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });
// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });

// app.get('/', (req, res) => {
//   res.render('auth');
// });

// app.use('/auth/google', authRouter);
// app.use('/auth/facebook', facebookRouter);
// app.use('/auth/github', githubRouter);
// app.use('/protected', protectedRouter);

// app.listen(6420,async()=>{
//     try{
//          await connection
//          console.log("connected to db")
//          console.log("server is running at port 8080");
//     }catch(err){
//         console.log(err);
//     }
    
// })