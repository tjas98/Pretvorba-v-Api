var express = require('express');
var router = express.Router();

const contrTekma = require('../controllers/tekma')

/* GET home page. */
router.get('/pop_up_tekma', (req, res) => {
  res.render('pop_up_tekma', { title: 'Tap & Play' })
});

router.get('/ustvari_tekmo', contrTekma.ustvariTekmo);

module.exports = router;