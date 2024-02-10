const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const likeSchema = new mongoose.Schema({
     user_id: {type:ObjectId, required : true, ref:'user'},
     post_id: {type:ObjectId, required:true, ref: 'post'},
     commentCount: {type:Number, default:0},
},{timestamps:true})


const LikeModel = mongoose.model('like', likeSchema);

module.exports = {
LikeModel
}