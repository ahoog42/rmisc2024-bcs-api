var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to the RMISC 2024 API!' })
});

module.exports = router;
