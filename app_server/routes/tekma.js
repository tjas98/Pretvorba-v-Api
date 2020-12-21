var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/pop_up_tekma', (req, res) => {
  res.render('pop_up_tekma', { title: 'Tap & Play' })
});

router.get('/ustvari_tekmo', (req, res) => {
    res.render('ustvari_tekmo', { title: 'Tap & Play' })
  });

module.exports = router;