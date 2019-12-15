const expressConfig = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,append,delete,entries,foreach,get,has,keys,set,values,Authorization');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: 'main-layout',
        partialsDir: 'views/partials',
        extname: 'hbs'
    }));

    app.set('view engine', 'hbs');

    app.use(expressConfig.static('./static'));

    app.use(cookieParser());

    app.use(bodyParser.json());
};