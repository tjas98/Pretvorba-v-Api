const express = require('express');
const router = express.Router();
const contrPrijava = require('../controllers/prijava');
const passport = require('passport');

router.post('/register', contrPrijava.register)

router.post('/pozabil_geslo', contrPrijava.pozabil_geslo);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Uspešno ste se odjavili');
    res.redirect('/login');
});

module.exports = router;