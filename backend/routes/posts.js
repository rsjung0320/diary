const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

// update는
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", PostController.getPosts);

// param과 body를 잘 구문해서 쓰자!!
router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
