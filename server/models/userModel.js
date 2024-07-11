const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  posts: { type: Number, default: 0 },
  verifyEmailToken: { type: String },
  isVerified: { type: Boolean, default: false }
});

module.exports = model('User', userSchema);
