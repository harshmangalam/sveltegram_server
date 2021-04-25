const Post = require("../models/post.model");
const User = require("../models/user.model");

const {
  ACCESS_DENIED_ERR,
  POST_NOT_FOUND,
  POST_ALREADY_LIKED,
  POST_NOT_LIKED,
} = require("../errors");

exports.getAllPosts = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const posts = await Post.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page)
      .populate("user", "-password")
      .populate("likes", "name profilePic");
    const totalPosts = await Post.estimatedDocumentCount();

    return res.status(200).json({
      type: "success",
      message: "fetch all posts",
      data: {
        posts,
        pagination: {
          totalPosts,
          totalPage: Math.ceil(totalPosts / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.explorePosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    console.log("followings", currentUser.followings);

    const posts = await Post.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page)
      .populate("user", "-password")
      .populate("likes", "name profilePic");
    const totalPosts = await Post.estimatedDocumentCount();

    return res.status(200).json({
      type: "success",
      message: "fetch all posts",
      data: {
        posts,
        pagination: {
          totalPosts,
          totalPage: Math.ceil(totalPosts / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "-passwprd")
      .populate("likes", "name profilePic");

    return res.status(200).json({
      type: "success",
      message: "fetch single post by id",
      data: {
        post,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const newPost = new Post({
      ...req.body,
      user: currentUser._id,
    });

    const savePost = await newPost.save();

    const post = await Post.findById(savePost._id)
      .populate("user", "name profilePic")
      .populate("likes", "name profilePic");

    return res.status(201).json({
      type: "success",
      message: " post created successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return next({ status: 404, message: POST_NOT_FOUND });
    }

    if (post.user.toString() !== currentUser._id.toString()) {
      return next({ status: 401, message: ACCESS_DENIED_ERR });
    }

    const modify = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    })
      .populate("user", "name profilePic")
      .populate("likes", "name profilePic");

    return res.status(201).json({
      type: "success",
      message: "post updated successfully",
      data: {
        post: modify,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return next({ status: 404, message: POST_NOT_FOUND });
    }

    if (post.user.toString() !== currentUser._id.toString()) {
      return next({ status: 401, message: ACCESS_DENIED_ERR });
    }

    await post.delete();

    return res.status(201).json({
      type: "success",
      message: "post deleted successfully",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { likes: currentUser._id },
      },
      { new: true }
    )
      .populate("likes", "name profilePic")
      .populate("user", "name profilePic");
    return res.status(201).json({
      type: "success",
      message: "post liked successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.unLikePost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { postId } = req.params;

    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: currentUser._id },
      },
      { new: true }
    )
      .populate("user", "name profilePic")
      .populate("user", "name profilePic");

    return res.status(201).json({
      type: "success",
      message: "post unlike successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    return next(error);
  }
};
