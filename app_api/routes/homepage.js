const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const contrHomepage = require('../controllers/homepage')


router.get('/tekme',  contrHomepage.homepage);


module.exports = router;