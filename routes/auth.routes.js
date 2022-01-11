const express = require('express');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/auth');
const bcrypt = require('bcrypt');
const router = express.Router();
const userSchema = require('../models/users');
const res = require('express/lib/response');

//sign in

router.post('/signin-user', (req, res, next) => {
  let getUser;
  userSchema
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed',
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: 3600 }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        msg: getUser,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Auth fail',
      });
    });
});

// sign up

router.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new userSchema({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((response) => {
        res.status(201).json({
          message: 'User Created',
          result: response,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
});

router.route('/all-user').get(authorize, (req, res) => {
  userSchema.find((error, response) => {
    if (error) {
      return next(error);
    }
    res.status(200).json(response.map((e) => e.name));
  });
});

// validate

router.route('/verify').get(authorize, (req, res) => {
  res.status(200).json('response');
});
module.exports = router;
