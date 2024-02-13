const { mongoose } = require("mongoose");

const blacklistSchema = mongoose.Schema({
    access_token:{
        type : String,
        require : true
    },
    refresh_token:{
        type : String,
        require : true
    }
},{
    versionKey: false
})

const blacklistModel= mongoose.model("blacklist", blacklistSchema)

module.exports={
    blacklistModel
}