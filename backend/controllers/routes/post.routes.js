const express = require("express")
const {uploadMiddleware} = require("../middlewares/fileUpload");
const {MediaModel, PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const postRouter = express.Router();
const {auth} = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

// CREATE POST
postRouter.post("/create_post/:userID", auth,uploadMiddleware, async(req,res)=>{
   
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
    console.log(req.body.user_id);
    req.body.user_id= req.params.userID
   const post = await PostModel.create(req.body)
    res.status(200).json({msg:"Post Created", data:post})
  }
  catch(err){
    console.log(err);
    res.status(400).json({msg:"Uploading failed!"})
  }
})

// GET ALL POSTS
postRouter.get("/all_post", async(req,res)=>{
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const user_id = req.query.user_id;

  const totalPosts = await PostModel.countDocuments({})
  const totalPages = Math.ceil(totalPosts/limit)
  const startIdx = (page-1) * limit
  try{
    const posts = await PostModel.aggregate([
    {
       $lookup: {
          from:"likes", let :{post_id:"$_id"}, pipeline: [
             {
              $match:{
                 $expr:{
                    $and:[
                      {$eq:['$post_id','$post_id']},
                      {$eq:['$user_id',new mongoose.Types.ObjectId(user_id)]}
                    ]
                 },
              },
             }
          ],
          as:'likes'
       },
    },
    {
      $addFields:{
        isLike:{
          $cond:{
            if:{$gt:[{size:'$likes'},0]},
            then: true,
            else: false
          }
        }
      }
    },
    {
       $project:{likes:0}
    },
    {
      $skip:(page-1)*limit,
    },{
     $limit:limit,
    },{
      $sort:{createdAt:-1}
    },
    ])
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
