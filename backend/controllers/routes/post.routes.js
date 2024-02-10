const express = require("express")
const {uploadMiddleware} = require("../middlewares/fileUpload");
const {MediaModel, PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const postRouter = express.Router();

// CREATE POST
postRouter.post("/create_post", uploadMiddleware, async(req,res)=>{
   
  try{
    const files = req.files;
    const media = files.map((val,i)=>{
      return {
        type:val.mimetype == 'video/mp4'?"video":"image",
        url: base_url+val.filename
      }
    })
    req.body.media = media;
    
    console.log("Fine")
    console.log(req.body);
   const post = await PostModel.create(req.body)
    res.status(200).json({msg:"Post Created", data:post})
  }
  catch(err){
    res.status(400).json({msg:"Uploading failed!"})
  }
})

// GET ALL POSTS
postRouter.get("/all_post", async(req,res)=>{
  try{
    const posts = await PostModel.find({});
    res.status(200).json({msg:"All Post", data:posts})
  }
  catch(err){
    res.status(400).json({msg:"Failed to load posts !"})
  }
})

// DELETE POST

module.exports = {
    postRouter
}
