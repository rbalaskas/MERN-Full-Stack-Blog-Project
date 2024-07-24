
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const Post = require("../models/postModel")
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')



/*================= Create Post ================ */
//post: api/posts/
//protected
const createPost = async (req,res,next) =>{
   try{

    let {title, category, description} = req.body;
    if(!title || !category || !description || !req.files){
        return next(new HttpError("All fields are required to create a new post."),422);
    }

    const {thumbnail} = req.files;
    if(thumbnail.size > 20000000){
        return next(new HttpError("Thumbnail is too big. File should be less than 2MB."),422);
    }

    let fileName = thumbnail.name;
    let splittedFileName = fileName.split(".");
    let newFilename = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length -1]
    
    thumbnail.mv(path.join(__dirname, '..', '/uploads',newFilename), async (err)=>{
        if(err){
            return next(new HttpError(err))
        }
        else{
            const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.userId})
            if(!newPost){
                return next(new HttpError("Post could't be created"),422);
            }
            const currentUser = await User.findById(req.user.userId);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.userId, {posts: userPostCount});

            res.status(201).json(newPost);
        }

    })

   }
   catch(error){
    return res.status(500).json({ message: "An unexpected error.", error: error.message });
   }
}





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
const deletePost = async (req,res,next) =>{
    try{

        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post Unavailable"),400);
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if(req.user.userId == post.creator){
            fs.unlink(path.join(__dirname, '..','uploads',fileName),async (err)=> {
                if(err){
                    return next(new HttpError(err));
                }
                else{
                    await Post.findByIdAndDelete(postId);
                    const currentUser = await User.findById(req.user.userId);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.userId, {posts:userPostCount});
                }
            })
            res.json(`Post ${postId} deleted Successfully.`);
        }
        else{
            return next(new HttpError("Post couldn't be deleted."),403);
        }
    }
    catch(error){
        return next(new HttpError(error));
    }
}


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

module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost, getPopularPosts }