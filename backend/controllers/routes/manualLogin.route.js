const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../../models/user.model");
const cookieparser = require("cookie-parser");

const {generateOtp,sendEmailVerification, sendSMSVerification}=require('../../controllers/middlewares/otpRegistration.middleware');
const {redisClient}=require('../../controllers/middlewares/redis.middleware');

const userRouter = express.Router();
userRouter.use(cookieparser());


userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ user_data: users });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});



userRouter.post("/register", async (req, res) => {
  const { name, emailorphone, password,otp } = req.body;

  try {
    if (
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*()_+{}[;]/.test(password) ||
      password.length < 8
    ) {
      return res.status(400).json({ msg: "Cannot register" });
    }
    if (typeof emailorphone === "string") {
      const email = emailorphone;

      if (email) {
        const existEmailUser = await User.findOne({ email });
        if (existEmailUser) {
          return res.status(400).json({ msg: "Email already exists" });
        }

        const storedOTP = await redisClient.get(email);
        if(storedOTP && storedOTP === otp){
            const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res
          .status(200)
          .json({ msg: "User registered successfully", registeredUser: user });
            // res.status(200).json({msg:"Otp verified"});
        }else{
            console.log(storedOTP," ",otp);
            res.status(400).json({error:"Invalid or expired OTP.Please request a new otp"})
        } 
      }
    } else {
        const phone = emailorphone;
      if (phone) {
        const existPhoneUser = await User.findOne({ phone });
        if (existPhoneUser) {
          return res.status(400).json({ msg: "Phone number already exists" });
        }

        // You might want to send an OTP to the phone number and verify it here.
        const storedOTP = await redisClient.get(phone);
        if(storedOTP && storedOTP === otp){
          const hashedPassword = await bcrypt.hash(password, 10);

          const user = new User({ name, phone, password: hashedPassword });
          await user.save();
        res
          .status(200)
          .json({ msg: "User registered successfully", registeredUser: user });
            // res.status(200).json({msg:"Otp verified"});
        }else{
            console.log(storedOTP," ",otp);
            res.status(400).json({error:"Invalid or expired OTP.Please request a new otp"})
        }
        // const hashedPassword = await bcrypt.hash(password, 10);

        // const user = new User({ name, phone, password: hashedPassword });
        // await user.save();
        // res
        //   .status(200)
        //   .json({ msg: "User registered successfully", registeredUser: user });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});
userRouter.post('/send-otp',async(req,res)=>{
    const {emailorphone}=req.body;

    
    const otp=generateOtp();
    try{
        if (typeof emailorphone === "string") {
            const email = emailorphone;
      
            if (email) {
              const existEmailUser = await User.findOne({ email });
              if (existEmailUser) {
                return res.status(400).json({ msg: "Email already exists" });
              }
                await redisClient.setex(email,120,otp.toString());
                sendEmailVerification(email,otp);
                res.status(200).json({msg:"OTP sent successfully"});

            }
        }else{
          const phone = emailorphone;
      
          if (phone) {
            const existEmailUser = await User.findOne({ phone });
            if (existEmailUser) {
              return res.status(400).json({ msg: "phone already exists" });
            }
              await redisClient.setex(phone,120,otp.toString());
              sendSMSVerification(phone,otp);
              res.status(200).json({msg:"OTP sent successfully"});
          }
        }
    }catch(err){
        res.status(500).json(err)
    }
})
// userRouter.post('/verify-otp',async(req,res)=>{
//     const {email,otp}=req.body;
    // const storedOTP=await redisClient.get(email);
    // if(storedOTP && storedOTP === otp){
    //     res.status(200).json({msg:"Otp verified"});
    // }else{
    //     console.log(storedOTP," ",otp);
    //     res.status(400).json({error:"Invalid or expired OTP.Please request a new otp"})
    // }
// })

userRouter.post("/login", async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    const user = (await User.findOne({ email })) || User.findOne({ phone });
    const name = user.username;
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(200).json({ msg: "user Does not exists!!!" });
        }
        if (result) {
          const access_token = jwt.sign(
            { userID: user._id, username: user.username },
            "shraddha",
            { expiresIn: "7d" }
          );
          const refresh_token = jwt.sign(
            { userID: user._id, username: user.username },
            "shraddha",
            { expiresIn: "14d" }
          );

          res.cookie("access_token", access_token, { httpOnly: true });
          res.cookie("refresh_token", refresh_token, { httpOnly: true });

          res
            .status(200)
            .json({
              msg: "Login successful!",
              name,
              access_token,
              refresh_token,
            });
        } else {
          window.alert("user Does not exists!!!");
          res.status(200).json({ msg: "user Does not exists!!!" });
        }
      });
    } else {
      res.status(200).json({ msg: "user Does not exists!!!" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});


userRouter.get("/logout", async (req, res) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  try {
    const blacklist = new blacklistModel({ access_token, refresh_token });
    await blacklist.save();

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ msg: "User has been logged out" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = {
  userRouter,
};
