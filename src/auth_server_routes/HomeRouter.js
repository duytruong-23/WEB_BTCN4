const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('home', {
        layout: 'main2'
    });
})


module.exports = router