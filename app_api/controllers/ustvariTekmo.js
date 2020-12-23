const Tekma = require('../models/Tekma');
const User = require('../models/User');

const ustvari_tekmo = (req, res) => {
    if(!req.user){
        return res.redirect('/login');
    }
    res.render('ustvari_tekmo', {
        ustvari_tekmo: true,
        user: req.user,
        title: "Ustvari tekmo"
    });
};


const ustvari_tekmo_POST = (req, res, done) => {
    
    let {lat, lng, kraj, datum, ura, minIgralcev, maxIgralcev, prijavljeni, komentarji } = req.body;
    prijavljeni += 1;

    let d = new Date(datum); //dd-mm-YYYY
    let t = new Date();
    t.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    if(d < t) {
        return;
    }else if(d + "" == t + ""){
        var now = new Date();

        if (now.getHours() + ":" + now.getMinutes() > ura + "") {
            return;
        }
    }

    const newTekma = new Tekma({
        kreator: req.user._id,
        lat,
        lng,
        kraj,
        datum,
        ura,
        minIgralcev,
        maxIgralcev,
        prijavljeni,
        opis: komentarji,
        igralci: [req.user._id],
        status: "prijave"
    });

    newTekma.save()
        .then(tekma => {
            User.updateOne(
                {_id: req.user},
                { $push: {tekme: tekma.id}},
                done
            );
            res.status(201).send()
            console.log(newTekma)
            //res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err)
           // res.redirect('/ustvari_tekmo');
        });
};

module.exports = {
    ustvari_tekmo,
    ustvari_tekmo_POST
}