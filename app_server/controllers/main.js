var apiParametri = {
    streznik: 'http://localhost:3000'
};
 
const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});
  
  const seznam = (req, res) => {
        prikazi(req,res)
  };

const prikazi = (req, res) => {
    res.render('hmpg', {
       title: "AAAA"
    });
}  

module.exports = {
    seznam
}

