// models/Comment.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Comment', commentSchema);
