var express = require('express');
var router = express.Router();

var contr = require('../controllers/main')

/* GET home page. */
router.get('/', contr.seznam)
module.exports = router;
