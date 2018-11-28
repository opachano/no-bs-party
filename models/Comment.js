const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
  user: String,
  content: String,
  post: String,
  likes: [{type: Schema.Types.ObjectId, ref: "User", default:[]}],
},
  {
    timestamps: true
  });

module.exports = mongoose.model("Comment", commentSchema);