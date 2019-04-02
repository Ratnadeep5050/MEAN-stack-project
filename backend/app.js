const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const userPostRoutes = require('./routes/userPost');

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
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTION");
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api', userRoutes);
app.use('/api', userRoutes);
app.use('/api/post', userPostRoutes);

module.exports = app;
