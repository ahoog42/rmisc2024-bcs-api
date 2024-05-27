var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ message: 'Array of recent Item 1C. Cybersecurity 10-Ks' })
});

module.exports = router;
