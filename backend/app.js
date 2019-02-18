const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://Toorja:pW3py3o4gnrdqMqo@cluster0-shard-00-00-zllfm.mongodb.net:27017,cluster0-shard-00-01-zllfm.mongodb.net:27017,cluster0-shard-00-02-zllfm.mongodb.net:27017/node-angular?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true')
.then(() => {
  console.log("Connected");
})
.catch(() => {
  console.log("Failed");
});

const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Send good',
      postId: createdPost._id
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(req.params.id);
    console.log(result);
    res.status(200).json({message: "Post deleted"});
  });
});

app.use("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Sent",
      posts: documents
    });
  });
});

module.exports = app;
