const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('home2', {
        layout: 'main2'
    });
})


module.exports = router