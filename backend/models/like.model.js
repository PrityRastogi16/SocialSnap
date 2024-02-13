const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const likeSchema = new mongoose.Schema({
     user_id: {type:ObjectId, required : true, ref:'User'},
     post_id: {type:ObjectId, required:true, ref: 'post'},
},
{timestamps:true}
)


const LikeModel = mongoose.model('like', likeSchema);

module.exports = {
LikeModel
}