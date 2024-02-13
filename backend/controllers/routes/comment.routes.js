const express = require("express")
const {CommentModel} = require("../../models/comment.model")
const {PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const commentRouter = express.Router();
const {auth} = require("../middlewares/auth")

// CREATE POST
commentRouter.post("/add_comment",auth, async(req,res)=>{
  const {post_id,user_id, comment} = req.body
  
  try{
    const result = await CommentModel.create(req.body);
    await PostModel.findByIdAndUpdate(
      post_id,{$inc:{commentCount:1}},{new:true}
    )
    res.status(200).json({msg:"Comment added successfully..", result})
  }
  catch(err){
    res.status(400).json({msg:"No like"})
  }
})

// GET ALL POSTS
commentRouter.get("/postcomment", async(req,res)=>{
  const {post_id} = req.query
  try{
    const posts = await PostModel.find({post_id:post_id}).populate({path:"user_id", select:"name"})
    
    res.status(200).json({msg:"All Post", data:posts})
  }
  catch(err){
    console.log(err);
    res.status(400).json({msg:"Failed to load posts !"})
    
  }
})

commentRouter.get("/delete_comment",auth, async(req,res)=>{
    const {comment_id, user_id} = req.body
    try{
      const deleteComment = await CommentModel.findByIdAndDelete({_id:comment_id,user_id})
      if(!!deleteComment){
        await PostModel.findByIdAndUpdate(
            deleteComment.post_id,{$inc:{commentCount:-1}},{new:true}
          )
          res.status(200).json({msg:"Comment Deleted", deleteComment})
      }else{
        res.status(400).json({msg:"Comment not Deleted", deleteComment})
      }
      
    }
    catch(err){
      console.log(err);
      res.status(400).json({msg:"Failed to load posts !"})
      
    }
  })

// DELETE POST

module.exports = {
    commentRouter
}