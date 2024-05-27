var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ message: 'Please POST username and password to get a jwt token' })
});

module.exports = router;
