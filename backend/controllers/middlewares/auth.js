const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = async(req,res,next)=>{
    const token = !!req?.headers["authorization"] ? req?.headers["authorization"].split(' ')[1] : null
    console.log("req header", token);
    if(!token){
        return res.status(400).send("You are not authorised")
    }
     try{
       const decoded = jwt.verify(token, process.env.TOKEN_KEY)
       req.user = decoded;
     }
     catch(error){
        return res.status(400).send("Invalid Token")
     }
    next() 
}