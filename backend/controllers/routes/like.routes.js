const express = require("express")
const {LikeModel} = require("../../models/like.model")
const {PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const likeRouter = express.Router();
const {auth} = require("../middlewares/auth")

// CREATE POST
likeRouter.post("/like", async(req,res)=>{
  const {post_id,user_id} = req.body
  const existingLike = await LikeModel.findOne({post_id, user_id});
  try{
   if(!existingLike){
    await LikeModel.create(req.body);
    await PostModel.findByIdAndUpdate(
      post_id,{$inc:{likeCount:1}},{new:true}
    )
    return res.status(200).json({msg:"Like added successfully"})
   }else{
    await LikeModel.findByIdAndRemove(existingLike._id);
    await PostModel.findByIdAndUpdate(
      post_id,{$inc:{likeCount:-1}},{new:true}
    )
    return res.status(200).json({msg:"Like removed successfully"})
   }
  }
  catch(err){
    res.status(400).json({msg:"No like"})
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