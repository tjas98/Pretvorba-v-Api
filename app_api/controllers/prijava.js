const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const User = require('../models/User');

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

const pozabil_geslo =  (req, res) => {
    const { email } = req.body;

    let novoGeslo = Math.random().toString(36).substring(1);

    console.log(email)

    User.findOne( {email: email}, function(err, user) {
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(novoGeslo, salt, (err, hash) => {
                if (err) throw err;

                user.password = hash;

                user.save(function (err) {
                    if (err) {
                        console.log(err)
                    }
                });

            }));



    })

    posljiEmail(email,'Sprememba gesla', "Novo geslo je: " + novoGeslo);
    res.redirect("/login");
}

const register = (req, res) => {
    const { name, surname, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if (password !== password2) {
        errors.push(1);
        req.flash('error', 'Gesli se ne ujemata');
    }

    if (password.length < 6) {
        errors.push(1);
        req.flash('error', 'Geslo mora vsebovati vsaj 6 znakov')
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            title: "Registracija",
            surname,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    //User exists
                    errors.push(1);
                    req.flash('error', 'Uporabnik že obstaja');
                    res.render('register', {
                        errors,
                        title: "Registracija",
                        name,
                        surname,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        surname,
                        email,
                        password
                    })
                    //Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;

                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash('success', 'Uspešno ste se registrirali')
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err))
                        }))
                }
            });
    }
};





module.exports = {
    pozabil_geslo,
    register
}