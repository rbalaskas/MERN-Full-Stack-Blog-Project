const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Nicosia", "Larnaca", "Paphos", "Limassol", "Ammochostos", "Cyprus"], message: "{VALUE is not supported}" },
  description: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  thumbnail: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: { type: Number, default: 0 },
  likesBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Track users who liked this post
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = model('Post', postSchema);
