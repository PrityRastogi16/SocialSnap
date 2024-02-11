const express = require("express")
const {LikeModel} = require("../../models/like.model")
const {PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const likeRouter = express.Router();
const {auth} = require("../middlewares/auth")

// CREATE POST
likeRouter.post("/like", async(req,res)=>{
   const {post_id} = req.body
   const existingLike = await LikeModel.findOne({post_id});
   return 
  try{
     console.log("Gooodddd")
    res.status(200).json({msg:"Post Created"})
  }
  catch(err){
    res.status(400).json({msg:"Uploading failed!"})
  }
})

// GET ALL POSTS
// likeRouter.get("/all_post",auth, async(req,res)=>{
//   try{
//     const posts = await PostModel.find({});
//     res.status(200).json({msg:"All Post", data:posts})
//   }
//   catch(err){
//     res.status(400).json({msg:"Failed to load posts !"})
//   }
// })

// DELETE POST

module.exports = {
    likeRouter
}
