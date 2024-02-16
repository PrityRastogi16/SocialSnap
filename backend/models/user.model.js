const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    //accountId can be google Id, facebook Id, github Id etc.
    accountId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    provider: {
      type: String,
    },
    password:{
      type: String
    },
    phone:{
      type: Number
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    notifications: [
      {
        type: String, // 'follow', 'like', 'comment', etc.
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    // facebookId: {
    //   type: String,
    // },
    // githubId: {
    //   type: String,
    // },
  },
  
  {
    timestamps: true,
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;