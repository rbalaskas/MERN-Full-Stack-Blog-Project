
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const Post = require("../models/postModel")
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')



const createPost = async (req, res, next) => {
    try {
      let { title, category, description } = req.body;
      if (!title || !category || !description || !req.files) {
        return next(new HttpError("All fields are required to create a new post.", 422));
      }
  
      const { thumbnail } = req.files;
      if (thumbnail.size > 2000000) { // 2MB size limit
        return next(new HttpError("Thumbnail is too big. File should be less than 2MB.", 422));
      }
  
      let fileName = thumbnail.name;
      let splittedFileName = fileName.split(".");
      let newFilename = `${splittedFileName[0]}_${uuid()}.${splittedFileName[splittedFileName.length - 1]}`;
  
      // Use promises to handle file saving
      await new Promise((resolve, reject) => {
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
  
      const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.userId });
      if (!newPost) {
        return next(new HttpError("Post couldn't be created", 422));
      }
  
      // Update the user points and post count
      await User.findByIdAndUpdate(
        req.user.userId,
        { 
          $inc: { posts: 1, totalPoints: 10 } 
        },
        { new: true } // Return the updated document
      );
  
      res.status(201).json(newPost);
    } catch (error) {
      return res.status(500).json({ message: "An unexpected error occurred.", error: error.message });
    }
  };
  





/*================= Get Posts ================ */
//post: api/posts/
//protected
const getPosts = async (req,res,next) =>{
    try{
        const posts = await Post.find().sort({updatedAt: -1});
        res.status(200).json(posts);
    }
    catch(error){
        return next(new HttpError(error));
    }
}





/*================= Get Single Post ================ */
//GET: api/posts/:id
//Unprotected
const getPost = async (req,res,next) =>{
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new HttpError("Post not found"),404);
        }
        res.status(200).json(post);
    }
    catch(error){
        return next(new HttpError(error));
    }
}




/*================= Get Posts by category ================ */
//GET: api/posts/categories/:category
//Unprotected
const getCatPosts = async (req,res,next) =>{
    try{
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1});
        res.status(200).json(catPosts);

    }
    catch(error){
        return next(new HttpError(error));
    }
}




/*================= Get user/author Post ================ */
//get: api/posts/users/:id
//Unprotected
const getUserPosts = async (req,res,next) =>{
    try{
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1});
        res.status(200).json(posts);


    }
    catch(error){
        return next(new HttpError(error));
    }
}




/*================= Edit Post ================ */
//patch: api/posts/:id
//protected
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("All fields are required, or check description length."), 422);
        }

        // Fetch the old post before using it
        const oldPost = await Post.findById(postId);

        if (req.user.userId == oldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
            } else {
                if (oldPost) { // Check if oldPost exists
                    fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                        if (err) {
                            return next(new HttpError(err));
                        }
                    })
                }

                const { thumbnail } = req.files;

                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail too big. Should be less than 2MB."));
                }
                fileName = thumbnail.name;
                let splittedFileName = fileName.split('.');
                newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1];
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                })

                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFileName },
                    { new: true })
            }
            res.status(200).json(updatedPost);
        }
        if (!updatedPost) {
            return next(new HttpError("Couldn't Update the Post."), 422);
        }

    }
    catch (error) {
        return next(new HttpError(error));
    }
}





/*================= Delete Post ================ */
//delete: api/posts/:id
//protected
const deletePost = async (req, res, next) => {
    try {
      const postId = req.params.id;
      if (!postId) {
        return next(new HttpError("Post Unavailable", 400));
      }
  
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return next(new HttpError("Post not found", 404));
      }
  
      // Check if the user is the creator of the post
      if (req.user.userId === post.creator.toString()) {
        // Remove the file associated with the post
        const fileName = post.thumbnail;
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
          if (err) {
            return next(new HttpError(err, 500));
          }
  
          // Find and update users who liked this post
          const usersWhoLiked = post.likesBy;
          for (const userId of usersWhoLiked) {
            const user = await User.findById(userId);
            if (user) {
              user.totalPoints = Math.max(user.totalPoints - 1, 0); // Deduct 1 point, ensure non-negative
              await user.save();
            }
          }
  
          // Delete the post
          await Post.findByIdAndDelete(postId);
  
          // Update the post creator's points and post count
          const currentUser = await User.findById(req.user.userId);
          if (currentUser) {
            const userPostCount = currentUser.posts - 1;
            const userTotalPoints = Math.max(currentUser.totalPoints - 10, 0); // Deduct 10 points, ensure non-negative
            await User.findByIdAndUpdate(
              req.user.userId,
              { posts: userPostCount, totalPoints: userTotalPoints },
              { new: true }
            );
          }
  
          res.json(`Post ${postId} deleted successfully.`);
        });
      } else {
        return next(new HttpError("Post couldn't be deleted.", 403));
      }
    } catch (error) {
      return next(new HttpError(error.message, 500));
    }
  };
  
  


/*================= Get Popular Post ================ */
//get: api/posts
//protected
const getPopularPosts = async (req, res) => {
    try {
      const popularPosts = await Post.aggregate([
        {
          $addFields: {
            totalEngagement: {
              $add: [{ $size: "$comments" }, "$likes"]
            }
          }
        },
        {
          $sort: { totalEngagement: -1 }
        },
        {
          $limit: 3
        }
      ]).exec();
  
      res.status(200).json(popularPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch popular posts' });
    }
  };


/*================= Increment View Count ================ */
//put: api/posts/:id/views
//unprotected
const incrementViewCountPost = async (req, res) => {
    try {
        const { id } = req.params;
    
        // Find the post by ID
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log("before : " + post.views);
        post.views += 1;
        console.log("after : " + post.views);

        await post.save();
    

        const user = await User.findById(post.creator);
        if (user) {
            console.log("user total views before : " +  user.totalviews);
            user.totalviews += 1;
            console.log("user total views after : " +  user.totalviews);
            await user.save();
        }
        // Return the updated post
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment view count for the current post' });
    }
};


module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost, getPopularPosts, incrementViewCountPost }