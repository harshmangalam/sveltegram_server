const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

const {
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  getPostById,
  likePost,
  unLikePost,
  explorePosts,
} = require("../controllers/post.controller");

router.post("/", checkAuth, createPost);
router.get("/explore", checkAuth, explorePosts);

router.put("/:postId", checkAuth, updatePost);

router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.delete("/:postId", checkAuth, deletePost);

router.put("/:postId/like", checkAuth, likePost);
router.put("/:postId/unlike", checkAuth, unLikePost);

module.exports = router;
