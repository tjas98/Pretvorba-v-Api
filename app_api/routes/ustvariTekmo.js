const express = require('express');
const router = express.Router();

const contrUstvariTekmo = require('../controllers/ustvariTekmo')


router.get('/ustvari_tekmo', contrUstvariTekmo.ustvari_tekmo);

router.post('/ustvari_tekmo', contrUstvariTekmo.ustvari_tekmo_POST);



module.exports = router;