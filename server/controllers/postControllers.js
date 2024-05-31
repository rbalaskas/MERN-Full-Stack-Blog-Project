
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
            const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.id})
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
    return next(new HttpError(error),422)
   }
}





/*================= Get Posts ================ */
//post: api/posts/
//protected
const getPosts = async (req,res,next) =>{
    res.json("Get All Posts");
}





/*================= Get Single Post ================ */
//GET: api/posts/:id
//Unprotected
const getPost = async (req,res,next) =>{
    res.json("Get Single Post");
}




/*================= Get Posts by category ================ */
//GET: api/posts/categories/:category
//Unprotected
const getCatPosts = async (req,res,next) =>{
    res.json("Get Posts by Category");
}




/*================= Get user/author Post ================ */
//get: api/posts/users/:id
//Unprotected
const getUserPosts = async (req,res,next) =>{
    res.json("Get User Post");
}




/*================= Edit Post ================ */
//patch: api/posts/:id
//protected
const editPost = async (req,res,next) =>{
    res.json("Edit Post");
}




/*================= Delete Post ================ */
//delete: api/posts/:id
//protected
const deletePost = async (req,res,next) =>{
    res.json("Delete Post");
}

module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost }