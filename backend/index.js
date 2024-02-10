const express = require('express');
const {connection}=require('./db');

const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("This is Home")
})
     
app.listen(6420,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 8080");
    }catch(err){
        console.log(err);
    }
    
})