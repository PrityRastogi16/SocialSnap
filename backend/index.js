const express = require('express');
const {connection}=require('./db');
const {postRouter} = require("./controllers/routes/post.routes")
const {likeRouter} = require("./controllers/routes/like.routes")

const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json());
app.use('/posts', postRouter)
app.use('/like',likeRouter)


app.get('/',(req,res)=>{
    res.send("This is Home")
})
     
app.listen(6420,async()=>{
    try{
         await connection
         console.log("connected to db")
         console.log("server is running at port 6420");
    }catch(err){
        console.log(err);
    }
    
})