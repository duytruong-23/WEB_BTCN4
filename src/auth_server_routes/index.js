const authorizationRouter = require('./AuthorizationRouter');
const homeRouter = require('./HomeRouter');

function route(app) {


    app.use('/authorization', authorizationRouter);
    app.use('/', homeRouter);
}

module.exports = route;