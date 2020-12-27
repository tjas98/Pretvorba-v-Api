var apiParametri = {
    streznik: 'http://localhost:3000' || process.env.NODE_ENV
};
 
const axios = require('axios').create({
    baseURL: apiParametri.streznik,
    timeout: 5000
});
  
  const seznam = (req, res) => {
      axios
      .get('/tekme')
      .then((tekma) => {
          prikazi(req, res, tekma.data)
      })
        
  };

const prikazi = (req, res, tekme) => {
    res.render('hmpg', {
       title: "Homepage",
       tekma: tekme,
       user: req.user
    });
}  

module.exports = {
    seznam
}

