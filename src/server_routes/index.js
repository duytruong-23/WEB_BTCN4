const homeRouter = require('./HomeRouter');
const pageRouter = require('./PageRouter');
const userRouter = require('./UserRouter');
const categoryRouter = require('./CategoryRouter');
const productRouter = require('./ProductRouter');
const authorizationRouter = require('./AuthorizationRouter');
const orderRouter = require('./OrderRouter');

function route(app) {

    app.use('/page', pageRouter);
    app.use('/user', userRouter);
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
    app.use('/authorization', authorizationRouter);
    app.use('/order', orderRouter);
    app.use('/', homeRouter);



}

module.exports = route;