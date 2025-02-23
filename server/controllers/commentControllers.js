// controllers/commentControllers.js
const Comment = require('../models/commentModel');
const Post = require("../models/postModel")
const User = require('../models/userModel');

const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = req.user; // Assuming userId is extracted from authentication middleware

  try {
    // Create a new comment
    const newComment = new Comment({
      postId,
      content,
      creator: userId,
    });

    // Save the new comment
    await newComment.save();

    // Add the new comment to the post's comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    // Find the post to get the creator
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the user who created the post
    const postCreator = await User.findById(post.creator);
    if (!postCreator) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user who made the comment
    const commenter = await User.findById(userId);
    if (!commenter) {
      return res.status(404).json({ message: 'Commenter not found' });
    }

    // Check if the commenter is the same as the post creator
    if (userId.toString() !== post.creator.toString()) {
      // Add points for the commenter
      commenter.totalPoints += 2;
      await commenter.save();

      // Add points for the post creator
      postCreator.totalPoints += 5;
      await postCreator.save();
    }

    // Update the totalComments field for the post creator
    postCreator.totalComments += 1;
    await postCreator.save();

    // Respond with a success message
    res.status(201).json("Comment Added Successfully!");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


  
  const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comment.find({ postId });
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
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const alreadyLiked = post.likesBy.includes(userId);

    if (alreadyLiked) {
      // User is unliking the post
      post.likes -= 1;
      post.likesBy = post.likesBy.filter(id => id.toString() !== userId);

      // Remove like points from the user who unliked the post
      const likingUser = await User.findById(userId);
      if (likingUser) {
        if (likingUser.totalPoints > 0) {
          likingUser.totalPoints -= 1;
          // Ensure totalPoints does not go below zero
          likingUser.totalPoints = Math.max(likingUser.totalPoints, 0);
          await likingUser.save();
        }
      }

      // Deduct points from the post creator
      const postCreator = await User.findById(post.creator);
      if (postCreator) {
        postCreator.totalPoints -= 3;
        // Ensure totalPoints does not go below zero
        postCreator.totalPoints = Math.max(postCreator.totalPoints, 0);
        await postCreator.save();
      }

    } else {
      // User is liking the post
      post.likes += 1;
      post.likesBy.push(userId);

      // Add like points to the user who liked the post
      const likingUser = await User.findById(userId);
      if (likingUser) {
        likingUser.totalPoints += 1;
        await likingUser.save();
      }

      // Add points to the post creator
      const postCreator = await User.findById(post.creator);
      if (postCreator) {
        postCreator.totalPoints += 3;
        await postCreator.save();
      }
    }

    // Save the post
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
