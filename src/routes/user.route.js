const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");

const {
  getUserById,
  getAllUsers,
  followUser,
  unFollowuser,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.put("/:userId", checkAuth, editUser);
router.delete("/:userId", checkAuth, deleteUser);

router.put("/:userId/follow", checkAuth, followUser);
router.put("/:userId/unfollow", checkAuth, unFollowuser);

module.exports = router;
