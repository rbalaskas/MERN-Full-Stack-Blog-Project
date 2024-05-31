const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum:["Nicosia", "Larnaca", "Paphos", "Limassol",
    "Ammochostos"], message: "{VALUE is not supported}" },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
}, {timestamps: true});

module.exports = model('Post', postSchema);