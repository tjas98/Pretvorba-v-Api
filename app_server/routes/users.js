var express = require('express');
var router = express.Router();

//Login page
router.get('/login', (req, res) => res.render('login', {title: "Prijava"}));

// Register Page
router.get('/register', (req, res) => res.render('register', {title: "Registracija"}));



module.exports = router;
