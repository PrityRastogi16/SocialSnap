const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const mediaSchema = new mongoose.Schema({
    type: {type:String, enum:['image','video'], required:false}
})

const postSchema = new mongoose.Schema({
     media: [mediaSchema],
     description: {type:String},
     user_id: {type:ObjectId, required : true, ref:'user'},
     likeCount: {type:Number, default:0},
     commentCount: {type:Number, default:0},
},{timestamps:true})


const MediaModel = mongoose.model('Media', mediaSchema);
const PostModel = mongoose.model('Post', postSchema);

module.exports = {
MediaModel, PostModel
}