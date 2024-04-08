    const Posts = require('../models/postModel')
    const  User = require("../models/userModel");
    const HttpError = require("../models/errorModel")
    const bcrypt= require("bcryptjs")
    const jwt = require("jsonwebtoken")
    const fs = require("fs");
    const {v4: uuid} =require("uuid");
    const path = require("path");


    // CREATE A POST
    // POST : api/posts
    // PROTECTED
    const createPost = async  (req , res , next) => {
        try {
            let {title , description , category} = req.body;
            if(!title || !description || !category || !req.files){
                return next (new HttpError("please fill all the details and try again" , 422))
            }
            const {thumbnail} = req.files;
            // check the size of the thumbnail 
            if(thumbnail.size > 2000000){
                return next (new HttpError("please try again with a reduced size" , 422))
            }
            const FileName = thumbnail.name;
            const SplittedName  = FileName.split('.');
            const newName = SplittedName[0] + uuid() + '.' + SplittedName[SplittedName.length - 1];
            thumbnail.mv(path.join(__dirname , '..' , 'uploads' , newName) ,async (err) => {
                if(err){
                    return next(new HttpError(err));
                } else{
                    const newPost = await Posts.create({title , category , description , thumbnail : newName , creator : req.user.id})
                    if(!newPost){
                        return next(new HttpError("couldn't create post " , 422));
                    }
                    // find the user and increment its count
                    const CurrentUser  = await User.findById(req.user.id);
                    const UserPostCount = CurrentUser.posts + 1 ;
                    await User.findByIdAndUpdate(req.user.id, {posts : UserPostCount})
                    res.status(201).json(newPost)
                }
            });
        } catch (error) {
            return next (new HttpError(error));
        }
    }

    // GET  ALL THE POST
    // GET : api/posts
    // PROTECTED
    const getPosts = async (req, res, next) => {
        try {
            const posts = await Posts.find().sort({ updatedAt: -1 });
            res.status(200).json(posts);
        } catch (error) {
            return next(new HttpError(error));
        }
    };


    // GET  A  SINGLE POST
    // GET : api/posts/:id
    // PROTECTED
    const getPost = async  ( req , res ,next) => {
        try {
            const postId = req.params.id;
            const posts = await Posts.findById(postId);
            if(!posts) {
                return next ( new HttpError("couldnt find the posts" , 422))
            }
            res.status(200).json(posts);
        } catch (error) {
            return next(new HttpError("couldn get the posts") , 422)
        }
    }

    // GET  A  POST BY CATEGORY
    // GET : api/posts/categories/:categories
    // UNPROTECTED
    const getCatPosts = async (req, res, next) => {
        try {
            const { category } = req.params; // Use req.params instead of req.body
            const catPosts = await Posts.find({ category }).sort({ createdAt: -1 });
            res.status(200).json(catPosts);
        } catch (error) {
            return next(new HttpError("Unable to get posts by categories", 422));
        }
    };
    

    // GET  A  AUTGHORS POST
    // POST : api/posts/users/:id
    // UNPROTECTED
    const getUsersPosts  = async  ( req , res , next) => {
        try {
            const{id} = req.params;
            const posts = await Posts.find({creator : id}).sort({createdAt : -1});
            // const posts = await Posts.findById(req.user.id);
            if(!posts){
                return next (new HttpError("no posts found" , 422))
            }
            res.status(200).json(posts);
        } catch (error) {
            return next (new HttpError("Unable to get users posts"))
        }
    }


    // EDIT  A  POST
    // PATCH : api/posts/:id
    // UNPROTECTED
    const editPost  = async  ( req ,res, next) => {
        try {
            let FileName;
            let SplittedName;
            let updatedPost;
            const postId = req.params.id;
            const{title , description , category} = req.body;
            if(!title || description.length < 12 || !category){
                return next (new HttpError("cant fetch posts"))
            }
            if(!req.files){
                updatedPost = await Posts.findByIdAndUpdate(postId ,{title , category , description } , {new:true});
            } else{
                // find old posts from database
                const oldPost = await Posts.findById(postId);
                if(req.user.id == oldPost.creator){
                // delete the old thumbnial from the post
                fs.unlink(path.join(__dirname, '..' , 'uploads' , oldPost.thumbnail) , async(err) =>{
                    if(err){
                        return next(new HttpError(err));
                    }    
                })
                const {thumbnail} = req.files;
                if(thumbnail.size > 2000000){
                    return next(new HttpError("too big image should be less than 2mb"));
                }
                    FileName = thumbnail.name;
                    SplittedName = FileName.split('.');
                const newFileName = SplittedName[0] + uuid() + '.' + SplittedName[SplittedName.length - 1];
                    thumbnail.mv(path.join(__dirname , '..' , 'uploads' , newFileName) , async() =>{
                        if(err){
                            return next(new HttpError(err));
                        }
                    });
                    updatedPost = await Posts.findByIdAndUpdate(postId , {title , category , description , thumbnail : newFileName} , {new : true})
            }
            
            if(!updatedPost) {
                return next (new HttpError("couldnt update post" , 400))
            }
        }
            res.status(200).json(updatedPost);
        } catch (error) {
            return next(new HttpError(error));
        }
    }


    // DELETE A  POST
    // DELETE : api/posts/:id
    // UNPROTECTED
    const deletePosts  = async  ( req , res , next) => {
       try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("couldn't find post" , 400))
        }

        const posts = await Posts.findById(postId);
        const fileName = posts?.thumbnail;
        if(req.user.id == posts.creator){
        fs.unlink(path.join(__dirname, '..' , 'uploads' , fileName) , async(err) =>{
            if(err){
                return next(new HttpError(err));
            }    else{
                await Posts.findByIdAndDelete(postId)
                // find user and decrase the post count
                const CurrentUser = await User.findById(req.user.id);
                const UserPostCount = CurrentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id , {posts : UserPostCount});
            }
        })
    }else{
        return next (new HttpError("post cant be deleted"))
    }
        res.json(`POST ${postId} deleted successfully`)
        if(!posts) {
            return next ( new HttpError("couldnt find the posts" , 422))
        }
       } catch (error) {
        return next(new HttpError(error));
       }
    }

    module.exports = {deletePosts , editPost , getUsersPosts , getPost , getCatPosts , createPost ,getPosts}