const express = require('express');

const PostController = require('../controllers/post');

const router = express.Router();

const extractFile = require('../middleware/file');

const checkAuth = require('../middleware/auth-check');

router.post("", checkAuth, extractFile, PostController.createPost);

router.get("/:id", PostController.getPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.delete("/:id", checkAuth, PostController.deletePost);

router.get("", PostController.getPosts);

module.exports = router;
