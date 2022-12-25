const initOptions = {/* initialization options */ };
const pgp = require('pg-promise')(initOptions);
const connection = require('./cnStr');

const db = pgp(connection);

module.exports = db;