const express = require("express")
const {CommentModel} = require("../../models/comment.model")
const {PostModel} = require("../../models/post.models")
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
    res.status(400).json({msg:"Comment not added"})
  }
})


// GET ALL POSTS
commentRouter.get("/post_comment", async(req,res)=>{
  const {post_id,page, limit} = req.query
  const totalComments = await CommentModel.countDocuments({post_id})
  console.log(totalComments);
  try{
    const comment = await CommentModel.find({post_id})
    
    res.status(200).json({msg:"All Comment", data:comment})
  }
  catch(err){
    console.log(err);
    res.status(400).json({msg:"Failed to load posts !"})
    
  }
})


// DELETE POST
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



module.exports = {
    commentRouter
}