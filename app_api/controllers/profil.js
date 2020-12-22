const Tekma = require('../models/Tekma');
const User = require('../models/User');
const mongoose = require('mongoose');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoURI = "mongodb://localhost:27017/test"

const conn = mongoose.createConnection( mongoURI ||process.env.MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true});

//init gfs
let gfs;
conn.once('open', () => {
    //stream na bazo za slike
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads');
})


//storage engine
const storage = new GridFsStorage({

    //docker
    //url: mongodb://mongo:27017/mongo-baza

    url: mongoURI || process.env.MONGODB_URI,
    file: (req, file) => {
        let id = req.user._id.toString();
        id = id + '.jpg';

        gfs.files.findOne({ filename: id.toString() }, (err, file) => {
            // Check if files
            if (!file || file.length === 0) {
            }
            else{
                gfs.remove({filename: id.toString(), root: 'uploads'}, (err, gridStore) => {
                    if (err) {
                    }
                });

            }
        });

        return new Promise((resolve, reject) => {

            //spremeni na id+extension
            const filename =  req.user._id.toString() + '.jpg';
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);

        });
    }
});

const izbrisi = (req,res) => {

    let id = req.user._id.toString();
    id = id + '.jpg';
    gfs.remove({filename: id.toString(), root: 'uploads'}, (err, gridStore) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/nastavitve_uredi');

}

const upload = multer({ storage });
//konec slik

const posljiEmail = (email,subject,text) => {
    const msg = {
        to: email.toString(),
        from: 'testektesto@gmail.com', // Use the email address or domain you verified above
        subject: subject.toString(),
        text: text.toString(),
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        }, error => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        });
}

var profil = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    let id = req.user._id.toString();
    id = id+'.jpg';
    gfs.files.findOne({ filename: id.toString() }, (err, file) => {
        // Check if files
        if (!file || file.length === 0) {
            res.render('profil',{
                image: false,
                profil: true,
                title: "Profil",
                user: req.user
            });
        } else {
            res.render('profil',{
                image: true,
                title: "Profil",
                slika: file.filename,
                profil: true,
                user: req.user
            });
        }
    });

};

var profil_ostali = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }
    let userId = req.params.id;
    User.find({_id: userId}, function (err,igralec){
        if(err){
            console.log(err);
            res.redirect("/");
        }

        igralec = igralec[0];
        let tekme = igralec.tekme;
        Tekma.find().where('_id').in(tekme).exec((err, records) => {
            gfs.files.findOne({ filename: igralec.toString() }, (err, file) => {
                // Check if files
                if (!file || file.length === 0) {
                    res.render('profil_ostali',{
                        image: false,
                        profil: true,
                        user: req.user,
                        title: "Profil",
                        name: igralec.name,
                        surname: igralec.surname,
                        email: igralec.email,
                        telefon: igralec.telefon,
                        ocena: igralec.ocena,
                        telDrugi: igralec.telDrugi,
                        emailDrugi: igralec.emailDrugi,
                        tekme: records
                    });
                } else {
                    res.render('profil_ostali',{
                        image: true,
                        slika: file.filename,
                        profil: true,
                        title: "Profil",
                        user: req.user,
                        name: igralec.name,
                        surname: igralec.surname,
                        email: igralec.email,
                        telefon: igralec.telefon,
                        ocena: igralec.ocena,
                        telDrugi: igralec.telDrugi,
                        emailDrugi: igralec.emailDrugi,
                        tekme: records
                    });
                }
            });
        });
    });

};

var nastavitve = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    let id = req.user._id.toString();
    id = id+'.jpg';
    gfs.files.findOne({ filename: id.toString() }, (err, file) => {
        // Check if files
        if (!file || file.length === 0) {
            res.render('nastavitve',{
                image: false,
                nastavitve: true,
                title: "Nastavitve",
                user: req.user
            });
        } else {
            res.render('nastavitve',{
                image: true,
                title: "Nastavitve",
                slika: file.filename,
                nastavitve: true,
                user: req.user
            });
        }
    });
};

var nastavitve_uredi = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    let id = req.user._id.toString();
    id = id+'.jpg';
    gfs.files.findOne({ filename: id.toString() }, (err, file) => {
        // Check if files
        if (!file || file.length === 0) {
            res.render('nastavitve_uredi',{
                image: false,
                nastavitve_uredi: true,
                title: "Nastavitve",
                user: req.user
            });
        } else {
            res.render('nastavitve_uredi',{
                image: true,
                title: "Nastavitve",
                slika: file.filename,
                nastavitve_uredi: true,
                user: req.user
            });
        }
    });

};

const najdiSliko = (req,res) =>{
    //id uporabnika
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
}

var moje_tekme = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    let id = req.user._id.toString();
    id = id+'.jpg';

    let tekme = req.user.tekme;
    Tekma.find().where('_id').in(tekme).exec((err, records) => {
        console.log(records);
        gfs.files.findOne({ filename: id.toString() }, (err, file) => {
            // Check if files
            if (!file || file.length === 0) {
                res.render('moje_tekme',{
                    image: false,
                    moje_tekme: true,
                    user: req.user,
                    title: "Moje tekme",
                    tekme: records,
                    user: req.user
                });
            } else {
                res.render('moje_tekme',{
                    image: true,
                    title: "Moje tekme",
                    slika: file.filename,
                    moje_tekme: true,
                    user: req.user,
                    tekme: records,
                    user: req.user
                });
            }
        });
    });
};

const nastavitve_uredi_POST = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    const { id, ime, priimek, email, telefon, geslo, geslo1 } = req.body;
    let errors = [];

    if(geslo !== geslo1){
        errors.push(1);
        req.flash('error', 'Gesli se ne ujemata');
    }

    if (geslo.length < 6) {
        errors.push(1);
        req.flash('error', 'Geslo mora vsebovati vsaj 6 znakov')
    }

    if (errors.length > 0) {
        res.render('nastavitve_uredi', {
            errors,
            ime,
            title: "Nastavitve",
            priimek,
            email,
            telefon,
            geslo,
            geslo1
        })
    }else{
        User.findOne({_id: id}, function (err, user) {
            user.name = ime;
            user.surname = priimek;
            user.email = email;
            user.telefon = telefon;

            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(geslo, salt, (err, hash) => {
                    if (err) throw err;

                    user.password = hash;

                    user.save(function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });

                }));
        });
    }

    posljiEmail(email,'Sprememba nastavitev','Nastavitve uspešno spremenjene');
    setTimeout(function() {res.redirect('/nastavitve')},500);
}

const nastavitve_POST = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }

    const {emailOdpoved, emailprihajujoče} = req.body;
    let errors = [];


    let id = req.user._id;

    User.findOne({_id: id}, function (err, user) {
        if(!emailOdpoved)
            user.emailOdpade = false;
        else
            user.emailOdpade = true;

        if(!emailprihajujoče)
            user.emailPrihaja = false;
        else
            user.emailPrihaja = true;

        user.save(function (err) {
            if (err) {
                console.log(err);
            }
        });

    });
    res.redirect('/nastavitve');
}

const nastavitve_osebni_POST = (req,res) =>{

    if(!req.user){
        return res.redirect('/login');
    }

    const {telPokazi, emailPokazi} = req.body;
    let errors = [];

    User.findOne({_id: req.user._id}, function (err, user) {

        if(!telPokazi)
            user.telDrugi = false;
        else
            user.telDrugi = true;

        if(!emailPokazi)
            user.emailDrugi = false;
        else
            user.emailDrugi = true;

        user.save(function (err) {
            if (err) {
                console.log(err);
            }
        });

    });
    res.redirect('/nastavitve');

}

const nalozi = upload.single('file');

const nalozi_sliko = (req, res) => {

    if(!req.user){
        return res.redirect('/login');
    }
    res.redirect('/profil');

};

const izbrisiUporabnika = (req, res) => {
    id = req.user._id;
    User.deleteMany({_id: id}, function (err) {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect("/logout")
        }
    })

}


module.exports = {
    moje_tekme,
    profil,
    nastavitve,
    nastavitve_uredi,
    najdiSliko,
    profil_ostali,
    nastavitve_uredi_POST,
    nastavitve_POST,
    nastavitve_osebni_POST,
    nalozi_sliko,
    izbrisi,
    izbrisiUporabnika,
    nalozi
}
