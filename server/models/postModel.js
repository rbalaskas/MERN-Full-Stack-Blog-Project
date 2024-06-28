const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum:["Nicosia", "Larnaca", "Paphos", "Limassol",
    "Ammochostos", "Cyprus"], message: "{VALUE is not supported}" },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    thumbnail : { type: String, required: true },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
}, {timestamps: true});

module.exports = model('Post', postSchema);


// To add comments and likes to post code


// const mongoose = require('mongoose');
// const { Schema, model } = mongoose;

// // Define the Comment Schema
// const commentSchema = new Schema({
//     content: { type: String, required: true },
//     creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// // Define the Post Schema
// const postSchema = new Schema({
//     title: { type: String, required: true },
//     category: { type: String, enum:["Nicosia", "Larnaca", "Paphos", "Limassol", "Ammochostos"], message: "{VALUE} is not supported" },
//     description: { type: String, required: true },
//     creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     comments: [commentSchema],
//     likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     views: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = model('Post', postSchema);
