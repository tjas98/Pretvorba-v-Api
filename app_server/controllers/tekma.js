var apiParametri = {
    streznik: 'http://localhost:3000' || process.env.NODE_ENV
};

/*
const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});
  
  const seznam = (req, res) => {
      axios
      .get('/ustvari_tekmo')
      .then((odg) => {
          prikazi(req, res, odg.data)
      })
        
  };

const prikazi = (req, res) => {
    res.render('ustvari_tekmo', {
       title: "Ustvari tekmo",
       user: req.user
    });
}  
*/

const ustvariTekmo = (req, res) => {
    
    res.render('ustvari_tekmo', {
        ustvari_tekmo: true,
        user: req.user,
        title: "Ustvari tekmo"
    });
};

module.exports = {
    ustvariTekmo
}
