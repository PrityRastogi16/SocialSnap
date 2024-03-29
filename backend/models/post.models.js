const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const mediaSchema = new mongoose.Schema({
    type: {type:String, enum:['image','video'], required:false}
})

const postSchema = new mongoose.Schema({
     media: [mediaSchema],
     imageURL: String,
     description: {type:String},
     user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
     likeCount: {type:Number, default:0},
     commentCount: {type:Number, default:0},
},
{timestamps:true}
)


const MediaModel = mongoose.model('Media', mediaSchema);
const PostModel = mongoose.model('Post', postSchema);

module.exports = {
MediaModel, PostModel
}