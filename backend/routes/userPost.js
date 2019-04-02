const express = require('express');

const router = express.Router();

const UserPostController = require('../controllers/userPost');

router.get("/:userId", UserPostController.getPosts)

module.exports = router;
