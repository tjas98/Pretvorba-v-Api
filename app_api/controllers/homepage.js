const Tekma = require('../models/Tekma');
const User = require('../models/User');

var homepage = (req, res) => {
    Tekma.find({}).lean().exec({}, function (err, tekma) {
        res.send(tekma)
    });
};

module.exports = {
    homepage
}