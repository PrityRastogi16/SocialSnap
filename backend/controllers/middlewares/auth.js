const jwt = require('jsonwebtoken');
require("dotenv").config();


const auth = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if(!token){
        return res.status(400).send("You are not authorised")
    }
     try{
       const decoded = jwt.verify(token, process.env.SESSION_SECRET)
       req.user = decoded;
       req.user._id = decoded.userID
       req.body.user_id = decoded.userID;
       console.log(req.body.user_id)
       req.body.user = decoded.user;
       next() 
     }
     catch(error){
        return res.status(400).send("Invalid Token")
     }
   
}


module.exports = {
    auth
}