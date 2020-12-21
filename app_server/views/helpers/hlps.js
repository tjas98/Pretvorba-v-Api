
const hbs = require('hbs');

hbs.registerHelper('ocenaIgralca', (ocena) => {
    if(ocena === 0)
        return "<span class=\"badge badge-secondary\">NI OCENE</span>";
    if(ocena < 2)
        return "<span class=\"badge badge-danger\">SLABA OCENA!</span>";
    if(ocena === 5)
        return "<span class=\"badge btn btn-success\">SUPER OCENA!</span>";

    return "<span class=\"badge btn btn-primary\">POVPREČNA OCENA</span>";
})

hbs.registerHelper('zvezdica', (ocena) => {
    let rezultat = "";
        for(var i = 0; i < 5; i++){
            if(ocena > 0) {
                rezultat += "<span class=\"fa fa-star checked\"></span>";
                ocena --;

            }
            else
                rezultat += "<span class=\"fa fa-star\"></span>";
        }
        return rezultat;
})

hbs.registerHelper('pridobiMesto', (kraj) => {
    let k = kraj + "";
    let n = k.split(',');
    return n[n.length - 1]
})

hbs.registerHelper('upper', (kraj) => {
    let k = kraj + "";
    let n = k.split(',');
    return n[n.length - 1].toUpperCase();
})

hbs.registerHelper('lower', (kraj) => {
    let k = kraj + "";
    let n = k.split(',');
    return n[n.length - 1].toLowerCase();
})

hbs.registerHelper('status', (kraj) => {
    if(status === 'prijave'){
        return "badge-primary";
    }else if(status === 'zakljucena'){
        return "badge-success";
    }else{
        return "badge-danger";
    }
})
/*
module.exports = {
    zvezdica: function (ocena){
        let rezultat = "";
        for(var i = 0; i < 5; i++){
            if(ocena > 0) {
                rezultat += "<span class=\"fa fa-star checked\"></span>";
                ocena --;

            }
            else
                rezultat += "<span class=\"fa fa-star\"></span>";
        }
        return rezultat;
    },
    ocenaIgralca: function (ocena) {
        if(ocena === 0)
            return "<span class=\"badge badge-secondary\">NI OCENE</span>";
        if(ocena < 2)
            return "<span class=\"badge badge-danger\">SLABA OCENA!</span>";
        if(ocena === 5)
            return "<span class=\"badge btn btn-success\">SUPER OCENA!</span>";

        return "<span class=\"badge btn btn-primary\">POVPREČNA OCENA</span>";
    },
    pridobiMesto: function (kraj) {
        let k = kraj + "";
        let n = k.split(',');
        return n[n.length - 1]
    },
    upper: function (kraj){
        let k = kraj + "";
        let n = k.split(',');
        return n[n.length - 1].toUpperCase();
    },
    lower: function (kraj){
        let k = kraj + "";
        let n = k.split(',');
        return n[n.length - 1].toLowerCase();
    },
    status: function (status){
        if(status === 'prijave'){
            return "badge-primary";
        }else if(status === 'zakljucena'){
            return "badge-success";
        }else{
            return "badge-danger";
        }
    }

    //dodal rihard
    
    convert: function(context) {
        return JSON.stringify(context);
    }

     
 //konec dodaje
};

//dodal rihard
('json', function(context) {
    return JSON.stringify(context);
});
*/

//konec dodaje
