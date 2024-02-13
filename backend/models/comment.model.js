const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const commentSchema = new mongoose.Schema({
     user_id: {type:ObjectId, required : true, ref:'User'},
     post_id: {type:ObjectId, required:true, ref: 'post'},
     comment: {type:String, required:true}
},{timestamps:true})


const CommentModel = mongoose.model('comment', commentSchema);

module.exports = {
CommentModel
}