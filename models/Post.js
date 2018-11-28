const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  user: {type: Schema.Types.ObjectId, ref: "User"},
  content: String,
  image: String,
  likes: [{type: Schema.Types.ObjectId, ref: "User", default:[]}],
  comments: [{type: Schema.Types.ObjectId, ref: "Comment", default:[]}],
},
  {
    timestamps: true
  });

module.exports = mongoose.model("Post", postSchema);