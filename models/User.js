const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, lowercase: true, required: true},
  firstName: String,
  lastName: String,
  image: String,
  confirmed: {type: Boolean, default: false},
  admin: {type: Boolean, default: false},
  posts:[{type: Schema.Types.ObjectId, ref: "Post", default:[]}],
}, {
  timestamps: true
});


module.exports = mongoose.model("User", userSchema);