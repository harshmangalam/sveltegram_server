const User = require("../models/user.model");
const Post = require("../models/post.model");

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("followers", "name profilePic")
      .populate("followings", "name profilePic");
    const userPosts = await Post.find({ user: userId })
      .populate("user", "name profilePic")
      .populate("likes", "name profilePic");

    return res.status(200).json({
      type: "success",
      message: "fetch user by id",
      data: {
        user,
        posts: userPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
   
    let users;

    if (req.query.search) {
      users = await User.find({ $text: { $search: req.query.search } })
        .populate("followers", "name profilePic")
        .populate("followings", "name profilePic");
    } else {
      users = await User.find()
        .populate("followers", "name profilePic")
        .populate("followings", "name profilePic")
       
    }

    return res.status(200).json({
      type: "success",
      message: "fetch all users",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { userId } = req.params;

    let findUser = await User.findById(userId);
    let index = findUser.followers.findIndex(
      (u) => u._id.toString() == currentUser._id.toString()
    );
    if (index !== -1) {
      return next({ status: 400, message: "Already follow" });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { followers: currentUser._id },
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $push: { followings: userId },
      },
      { new: true }
    )
      .populate("followers", "name profilePic")
      .populate("followings", "name profilePic");
    return res.status(200).json({
      type: "success",
      message: "follow user successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.unFollowuser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { userId } = req.params;

    let findUser = await User.findById(userId);
    let index = findUser.followers.findIndex(
      (u) => u._id.toString() == currentUser._id.toString()
    );
    if (index === -1) {
      return next({ status: 400, message: "Yet not follow" });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followers: currentUser._id },
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $pull: { followings: userId },
      },
      { new: true }
    )
      .populate("followers", "name profilePic")
      .populate("followings", "name profilePic");
    return res.status(200).json({
      type: "success",
      message: "unfollow user successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    })
      .populate("followers", "name profilePic")
      .populate("followings", "name profilePic");

    return res.status(200).json({
      type: "success",
      message: "update user data successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);

    return res.status(200).json({
      type: "success",
      message: "delete user data successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
