var express = require('express');
var router = express.Router();

router.get('/profil', (req, res) => {
    res.render('profil', { title: 'Profil' })
});

router.get('/nastavitve', (req, res) => {
    res.render('nastavitve', { title: 'Nastavitve' })
});

router.get('/moje_tekme', (req, res) => {
    res.render('moje_tekme', { title: 'Moje tekme' })
});

router.get('/nastavitve_uredi', (req, res) => {
    res.render('nastavitve_uredi', { title: 'Uredi nastavitve' })
});

module.exports = router;