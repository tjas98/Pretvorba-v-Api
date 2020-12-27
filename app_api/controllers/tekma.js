
const Tekma = require('../models/Tekma');
const User = require('../models/User');

var weather = require('openweather-apis');
weather.setUnits('metric');
weather.setAPPID('2d46165b2a3d0734271c8271f8c9e8fa');
weather.setLang('sl');


const podrobnostiTekme = (req, res) => {
    if(!req.user){
         return res.redirect('/login');
    }
    pridobiPodrobnostiTekme(req, res, (req, res, vsebina) => {
        prikaziPodrobnostiTekme(req, res, vsebina);
    });
};

const pridobiPodrobnostiTekme = (req, res, povratniKlic) => {
    let idTekme = req.params.id;
    let urejanje = req.params.urejanje;
    Tekma.findOne({_id: idTekme}).exec((err, tekma) => {
        if(err){
            console.log(err);
            res.status(400);
        }

        weather.setCoordinate(tekma.lat, tekma.lng);


        let playerIDs = tekma.igralci;
        User.find({_id: playerIDs}).lean().exec((err, igralci) => {
            if(err){
                console.log(err);
                res.status(400);
            }
            let ustvarnik = tekma.kreator;
            User.findOne({_id: ustvarnik}).lean().exec((err, kreator) => {
                if(err){
                    console.log(err);
                    res.status(400);
                }
                weather.getAllWeather(function(err, temp){
                    if(err) console.log(err);
                    let sodelujoci = [];
                    let pridruzen = false;
                    igralci.forEach(element => {
                        sodelujoci.push({   id: element._id,
                                            name: element.name,
                                            surname: element.surname,
                                            rating: element.ocena
                                            });

                        if(element._id + "" === req.user._id + ""){
                            pridruzen = true;
                        }
                    });
                    povratniKlic(req, res, {
                                            user: req.user,
                                            lahkoOcenjamo: true,
                                            ocenjamo: false,
                                            urejamo: false,
                                            pridruzen: pridruzen,
                                            tekma: tekma,
                                            kreator: kreator,
                                            sodelujoci: sodelujoci,
                                            vreme: temp
                                            });
                });
            });
        });
    })
};

const prikaziPodrobnostiTekme = (req, res, vsebina) => {

    let lahkoOcenjamo = false;
    let ocenjamo = false;
    let urejamo = false;
    let lahkoUrejamo = false;

    if(vsebina.tekma.status == 'prijave'){
        lahkoUrejamo = true;
    }else{
        if(vsebina.tekma.igralci.includes(req.user._id + "")){
            if(vsebina.tekma.zeOcenili.includes(req.user._id + "")){
                lahkoOcenjamo = false;
            }else{
                lahkoOcenjamo = true;
            }
        }
    }

    res.render('pop_up_tekma', {layout: vsebina.layout,
                                user: vsebina.user,
                                title: "Tekma",
                                lahkoOcenjamo: lahkoOcenjamo,
                                ocenjamo: ocenjamo,
                                urejamo: urejamo,
                                lahkoUrejamo: lahkoUrejamo,
                                pridruzen: vsebina.pridruzen,
                                tekma: vsebina.tekma,
                                kreator: vsebina.kreator,
                                vreme: vsebina.vreme,
                                sodelujoci: vsebina.sodelujoci});
};

const oceniIgralce = (req, res) => {
    if(!req.user){
         return res.redirect('/login');
    }
    pridobiPodrobnostiTekme(req, res, (req, res, vsebina) => {
        prikaziOcenjanjeTekme(req, res, vsebina);
    });
};

const prikaziOcenjanjeTekme = (req, res, vsebina) => {
    let lahkoOcenjamo = false;
    let ocenjamo = false;
    let urejamo = false;
    let lahkoUrejamo = false;
    if(vsebina.tekma.status == 'prijave'){
        return res.redirect('/pop_up_tekma/' + vsebina.tekma._id);
    }else{
        lahkoOcenjamo = true;
        ocenjamo = true;
    }

    res.render('pop_up_tekma', {layout: vsebina.layout,
                                user: vsebina.user,
                                title: "Tekma",
                                lahkoOcenjamo: lahkoOcenjamo,
                                ocenjamo: ocenjamo,
                                urejamo: urejamo,
                                pridruzen: vsebina.pridruzen,
                                tekma: vsebina.tekma,
                                kreator: vsebina.kreator,
                                vreme: vsebina.vreme,
                                sodelujoci: vsebina.sodelujoci});
};

const oceniIgralce_POST = (req, res, done) => {
    if(!req.user){
        return res.redirect('/login');
    }
    let idTekme = req.params.id;
    let ocene = req.body;
    Tekma.findOne({_id: idTekme}, function (err, tekma) {
        Tekma.updateOne(
            { _id: idTekme },
            { $push: { zeOcenili: req.user._id } },
            done
        );
        let playerIDs = tekma.igralci;
        User.find({_id: playerIDs}, function (err, igralci){
            if(err){
                console.log(err);
                res.redirect('/');
            }
            let i = 0;
            igralci.map(user => {
                if(ocene.ocena[i] >= 1 || ocene.ocena[i] <= 5){
                    let trenutnaOcena = user.ocena;
                    let trenutnoSteviloOcen = user.steviloOcen;

                    let koncnaOcena = trenutnaOcena + (ocene.ocena[i] - trenutnaOcena) / trenutnoSteviloOcen;
                    let koncnoStevilo = trenutnoSteviloOcen + 1;
                    user.ocena = koncnaOcena;
                    user.steviloOcen = koncnoStevilo;
                    user.save();
                    i++;
                }
            });
        });
    });
    res.redirect('/pop_up_tekma/' + idTekme);
};

const urediTekmo = (req, res, povratniKlic) => {
    if(!req.user){
         return res.redirect('/login');
    }
    pridobiPodrobnostiTekme(req, res, (req, res, vsebina) => {
        prikaziUrejanjeTekme(req, res, vsebina);
    });
};

const prikaziUrejanjeTekme = (req, res, vsebina) => {
    let lahkoOcenjamo = false;
    let ocenjamo = false;
    let urejamo = false;
    let lahkoUrejamo = false;

    if(vsebina.tekma.status == 'prijave'){
        lahkoUrejamo = true;
        urejamo = true;
    }

    res.render('pop_up_tekma', {layout: vsebina.layout,
                                title: "Tekma",
                                user: vsebina.user,
                                lahkoOcenjamo: lahkoOcenjamo,
                                ocenjamo: ocenjamo,
                                urejamo: urejamo,
                                pridruzen: vsebina.pridruzen,
                                tekma: vsebina.tekma,
                                kreator: vsebina.kreator,
                                vreme: vsebina.vreme,
                                sodelujoci: vsebina.sodelujoci});
};

const urediTekmo_POST = (req, res) => {
    if(!req.user){
        return res.redirect('/login');
    }
    const {datum, ura, komentarji} = req.body;
    let idTekme = req.params.id;
    Tekma.findOne({_id: idTekme}, function (err, tekma) {
        if(tekma.status != 'prijave'){
            tekma.datum = datum;
            tekma.ura = ura;
            tekma.opis = komentarji;
            tekma.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });

    res.redirect('/pop_up_tekma/' + idTekme);
};

const izbrisiTekmo = (req, res) => {
    if(!req.user){
        return res.redirect('/login');
    }
    let idTekme = req.params.id;
    Tekma.deleteOne({_id: idTekme}, function (err){
        if(err){
            console.log(err);
        }
    });
    res.redirect('/');
};

const pridruziSeTekmi = (req, res, done) => {
    console.log("PRIDURZI SE")
    if(!req.user){
        return res.redirect('/login');
    }

    let idTekme = req.params.id;

    Tekma.findOne({_id: idTekme}).lean().exec((err, t) => {
        if(t.status == 'prijave'){
            if(!t.igralci.includes(req.user._id + "")){
                Tekma.updateOne(
                     { _id: idTekme },
                     { $push: { igralci: req.user._id } },
                     done
                );
                Tekma.updateOne(
                     { _id: idTekme },
                     { $inc: { prijavljeni: 1}},
                     done
                );
            }
        }
    });

    let userid = req.user;
    User.updateOne(
        {_id: userid},
        { $push: {tekme: idTekme}},
        done
    );
    res.redirect('/');
};

const odjaviOdTekme = (req, res, done) => {
    if(!req.user){
        return res.redirect('/login');
    }

    let idTekme = req.params.id;

    Tekma.findOne({_id: idTekme}).lean().exec((err, t) => {
        if(t.status == 'prijave'){
            if(t.igralci.includes(req.user._id + "")){
                Tekma.updateOne(
                     { _id: idTekme },
                     { $pull: { igralci: req.user._id } },
                     done
                );
                Tekma.updateOne(
                     { _id: idTekme },
                     { $inc: { prijavljeni: -1}},
                     done
                );
            }
        }
    });

    let userid = req.user;
    User.updateOne(
        {_id: userid},
        { $pull: {tekme: idTekme}},
        done
    );
    res.redirect('/pop_up_tekma/' + idTekme);
};

module.exports = {
    podrobnostiTekme,
    urediTekmo,
    urediTekmo_POST,
    izbrisiTekmo,
    pridruziSeTekmi,
    odjaviOdTekme,
    oceniIgralce,
    oceniIgralce_POST
}