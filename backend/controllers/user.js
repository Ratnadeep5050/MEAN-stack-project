const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  let sendEmail = true;
  let emailID = req.body.email;
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: "User created",
        result: result
      })
    })
    .catch(err => {
      sendEmail = false;
        res.status(500).json({
          message: "This email already exists !"
        });
      });
    });

    if(sendEmail) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'toorjaandtoorja@gmail.com',
          pass: 'kali1linux2'
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      var mailOptions = {
        from: 'Toorja toorjaandtoorja@gmail.com',
        to: emailID,
        subject: 'IntrovertReaders',
        text: 'Thanks for signing up in IntrovertReaders'
      }

      transporter.sendMail(mailOptions, function(err, res){
        if(err){
          console.log('Failed sending');
        } else {
          console.log('Email sent');
        }
      });
    }
  }

  exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return result.status(401).json({
          message: "Auth Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result){
        return result.status(401).json({
          message: "Auth Failed"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        "E8PbieHoNk",
        { expiresIn: '1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials !"
      });
    })
  }

  exports.passwordChange = (req, res, next) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }, function(error, user) {
      if(error) {
        res.status(404).json({message: "Error"});
      } else {
        if(!user) {
          res.status(404).json({message: "No user"});
        } else {
          console.log(user.password);
          bcrypt.hash(req.body.password, 10).then(result => {
            user.password = result;
          });
        }
        user.save(function(err, changedUser){
          if(err) {
            console.log(err);
            res.status(500).json({message: "Error occurred"});
          } else {
            res.status(200).json({message: "Changed"});
          }
        })
      }
    })
 }
