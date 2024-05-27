// let's use .env for secrets. let's require and load dotenv
require('dotenv').config();
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.json({ message: 'Please POST username and password to get a jwt token' })
});

// for POST, accept a username and password. if they are not present, return a 400 status code
// if they are present, return a signed jwt token with an issuer of 'rmisc2024' and an expiration of 24 hours
router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    const token = jwt.sign({ username: req.body.username }, process.env.jwtSecret , { expiresIn: '24h', issuer: 'rmisc2024' });
    res.json({ token: token });
  } else {
    res.status(400).json({ message: 'Please provide a username and password' });
  }
});

module.exports = router;
