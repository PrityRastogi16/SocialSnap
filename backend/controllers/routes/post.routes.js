const express = require("express")
const {uploadMiddleware} = require("../middlewares/fileUpload");
const {MediaModel, PostModel} = require("../../models/post.models")
const base_url = "http://localhost:6420/"
const postRouter = express.Router();
const {auth} = require("../middlewares/auth");
const path = require("path");
const { default: mongoose } = require("mongoose");
const { update } = require("../../models/user.model");
const bucket = require("../middlewares/firebase.config")

// CREATE POST
// postRouter.post("/create_post/:userID", auth,uploadMiddleware, async(req,res)=>{
   
//   try{
//     const files = req.files;
//     const media = files.map((val,i)=>{
//       return {
//         type:val.mimetype == 'video/mp4'?"video":"image",
//         url: base_url+val.filename
//       }
//     })
//     req.body.media = media;
    
//     console.log("Fine")
//     console.log(req.body.user_id);
//     req.body.user_id= req.params.userID
//    const post = await PostModel.create(req.body)
//     res.status(200).json({msg:"Post Created", data:post})
//   }
//   catch(err){
//     console.log(err);
//     res.status(400).json({msg:"Uploading failed!"})
//   }
// })

postRouter.post("/create_post/:userID", auth, uploadMiddleware, async (req, res) => {
  try {
      const files = req.files;
      const description = req.description;
      const media = [];
      console.log(description);

      for (const file of files) {
          const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
          const fileUpload = bucket.file(fileName);
          const stream = fileUpload.createWriteStream({
              metadata: {
                  contentType: file.mimetype
              }
          });

          stream.on('error', (err) => {
              console.error(err);
              res.status(500).json({ msg: "Error uploading file" });
          });

          stream.on('finish', async () => {
              // Get the public URL of the uploaded file
              const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '01-01-2030', // Set an expiration date or period as needed
            });
             // const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
              media.push({ type: file.mimetype === 'video/mp4' ? 'video' : 'image'});
              

              if (media.length === files.length) {
                  // All files uploaded, now create the post
                  const post = await PostModel.create({
                      ...req.body,
                      user_id: req.params.userID,
                      media: media,
                      imageURL: url 
                  });
                  res.status(200).json({ msg: "Post Created", data: post });
              }
          });

          stream.end(file.buffer);
      }
  } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Uploading failed!" });
  }
});


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


// Update Post
postRouter.put('/update_post/:post_id', auth, async(req,res)=>{
  const {post_id} = req.params;
  try{
     const updatePost  = await PostModel.findByIdAndUpdate(post_id, req.files,{new:true});
     if(!updatePost){
      return res.status(400).json({msg:"Post not found!"})
     }
     res.status(200).json({msg:"Post Updated !", data:updatePost})
  }
  catch(err){
    console.log(err);
    res.status(400).json({msg:"Failed to update posts !"})
  }
})



// DELETE POST
postRouter.delete('/delete_post/:post_id', auth, async(req,res)=>{
  const {post_id} = req.params;
  try{
     const {post_id} = req.params;
     const deletePost = await PostModel.findByIdAndDelete(post_id);
     if(!deletePost){
      return res.status(400).json({msg:"Post not found"})
     }
     res.status(200).json({msg:"Post Deleted", data:deletePost});
  }
  catch(err){
    console.log(err);
    res.status(400).json({msg:"Failed to delete posts !"})
  }
})

module.exports = {
    postRouter
}
