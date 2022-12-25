const initOptions = {/* initialization options */ };
const pgp = require('pg-promise')(initOptions);

const connection = {
    host: 'localhost',
    port: 5432,
    database: 'dbtest',
    user: 'postgres',
    password: '123',
    max: 30 // use up to 30 connections
    // "types" - in case you want to set custom type parsers on the pool level
};

const db = pgp(connection);

module.exports = db;