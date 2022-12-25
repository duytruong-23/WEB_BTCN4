const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config({
    path: './.env'
});
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const route = require('./server_routes');
const handlebars = require('./configs/HandlebarsConfig');


const app = express();
const port = process.env.SERVER_PORT || 54321;

app.use(cookieParser());


handlebars(app);

// app.use(morgan('combined'));
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
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode)
        .send(statusCode + " " + err.message);
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});