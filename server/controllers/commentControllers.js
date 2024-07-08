// controllers/commentControllers.js
const Comment = require('../models/commentModel');
const Post = require("../models/postModel")

const addComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req.user; // Assuming userId is extracted from authentication middleware
  
    try {
      const newComment = new Comment({
        postId,
        content,
        creator: userId,
      });
  
      await newComment.save();
  
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
  
      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comment.find({ postId });
      console.log(comments);
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user;

  try {
    const comment = await Comment.findById(commentId);

    if (comment.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await comment.remove();
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if user already liked the post
      const alreadyLiked = post.likesBy.includes(userId);
  
      if (alreadyLiked) {
        // Unlike the post
        post.likes -= 1;
        post.likesBy = post.likesBy.filter(id => id.toString() !== userId);
      } else {
        // Like the post
        post.likes += 1;
        post.likesBy.push(userId);
      }
  
      await post.save();
  
      res.status(200).json({ likes: post.likes, isLiked: !alreadyLiked });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment,
    likePost,
  };
