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
// userRouter.post("/register", async (req, res) => {
//     const { username, emailorphone, password,otp } = req.body;
  
//     try {
//       if (
//         !/[A-Z]/.test(password) ||
//         !/\d/.test(password) ||
//         !/[!@#$%^&*()_+{}[;]/.test(password) ||
//         password.length < 8
//       ) {
//         return res.status(400).json({ msg: "Cannot register" });
//       }
//       if (typeof emailorphone === "string") {
//         const email = emailorphone;
  
//         if (email || username) {
//           const existEmailUser = await User.findOne({ email });
//           const existnameUser = await User.findOne({ username });
//           if (existEmailUser) {
//             return res.status(400).json({ msg: "Email already exists" });
//           }
//           if (existnameUser) {
//             return res.status(400).json({ msg: "username already exists" });
//           }
  
//           const storedOTP = await redisClient.get(email);
//           if(storedOTP && storedOTP === otp){
//               const hashedPassword = await bcrypt.hash(password, 10);
  
//           const user = new User({ username, email, password: hashedPassword });
//           await user.save();
//           res
//             .status(200)
//             .json({ msg: "User registered successfully", registeredUser: user });
//               // res.status(200).json({msg:"Otp verified"});
//           }else{
//               console.log(storedOTP," ",otp);
//               res.status(400).json({error:"Invalid or expired OTP.Please request a new otp"})
//           } 
//         }
//       } else {
//           const phone = emailorphone;
//         if (phone) {
//           const existPhoneUser = await User.findOne({ phone });
//           if (existPhoneUser) {
//             return res.status(400).json({ msg: "Phone number already exists" });
//           }
  
//           // You might want to send an OTP to the phone number and verify it here.
//           const storedOTP = await redisClient.get(phone);
//           if(storedOTP && storedOTP === otp){
//             const hashedPassword = await bcrypt.hash(password, 10);
  
//             const user = new User({ name, phone, password: hashedPassword });
//             await user.save();
//           res
//             .status(200)
//             .json({ msg: "User registered successfully", registeredUser: user });
//               // res.status(200).json({msg:"Otp verified"});
//           }else{
//               console.log(storedOTP," ",otp);
//               res.status(400).json({error:"Invalid or expired OTP.Please request a new otp"})
//           }
//           // const hashedPassword = await bcrypt.hash(password, 10);
  
//           // const user = new User({ name, phone, password: hashedPassword });
//           // await user.save();
//           // res
//           //   .status(200)
//           //   .json({ msg: "User registered successfully", registeredUser: user });
//         }
//       }
//     } catch (err) {
//       res.status(400).json({ error: err });
//     }
//   });
//   userRouter.post('/send-otp',async(req,res)=>{
//       const {emailorphone}=req.body;
  
      
//       const otp=generateOtp();
//       try{
//           if (typeof emailorphone === "string") {
//               const email = emailorphone;
        
//               if (email) {
//                 const existEmailUser = await User.findOne({ email });
//                 if (existEmailUser) {
//                   return res.status(400).json({ msg: "Email already exists" });
//                 }
//                   await redisClient.setex(email,120,otp.toString());
//                   sendEmailVerification(email,otp);
//                   res.status(200).json({msg:"OTP sent successfully"});
  
//               }
//           }else{
//             const phone = emailorphone;
        
//             if (phone) {
//               const existEmailUser = await User.findOne({ phone });
//               if (existEmailUser) {
//                 return res.status(400).json({ msg: "phone already exists" });
//               }
//                 await redisClient.setex(phone,120,otp.toString());
//                 sendSMSVerification(phone,otp);
//                 res.status(200).json({msg:"OTP sent successfully"});
//             }
//           }
//       }catch(err){
//           res.status(500).json(err)
//       }
//   })