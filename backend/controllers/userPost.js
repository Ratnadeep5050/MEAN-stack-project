const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  let maxPosts = 10;
  Post.find({ creator: req.params.userId }).then(posts => {
    if(posts) {
      res.status(200).json({
        posts,
        message: "Post successful",
        max: maxPosts
      });
    } else {
      res.status(500).json({
        message: "Failed to get User Post"
      });
    }
  });
}
