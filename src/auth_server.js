const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config({
    path: './.env'
});
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const options = {
    key: fs.readFileSync('./src/https/localhost-key.pem'),
    cert: fs.readFileSync('./src/https/localhost.pem'),
};


const route = require('./auth_server_routes');
const handlebars = require('./configs/HandlebarsConfig');


const app = express();
const port = process.env['PORT'] || 3000;
app.use(cookieParser());

handlebars(app);

//public file
app.use(express.static(path.join(__dirname, 'public')));
//midleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());



route(app);

app.use('*', (req, res, next) => {
    const err = new Error('Page not found');
    err.statusCode = 404;
    next();
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode)
        .send(statusCode + " " + err.message);
});


https.createServer(options, app).listen(port, () => {
    console.log(`Example app listening on https://localhost:${port}`);
});