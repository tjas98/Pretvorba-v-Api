var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('hmpg', { title: 'Tap & Play' })
});

module.exports = router;
