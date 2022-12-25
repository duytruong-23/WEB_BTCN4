const hbsH = require('../helpers/hbs_helpers');
const hbs = require('express-handlebars');
const path = require('path');

function handlebars(app) {
    app.engine('hbs', hbs.engine({
        extname: "hbs",
        layoutsDir: path.join(__dirname, "../resources/views", "layouts"),
        partialsDir: path.join(__dirname, "../resources/views", "partials"),
        defaultLayout: "main",
        helpers: hbsH
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../resources/views'));
}

module.exports = handlebars;