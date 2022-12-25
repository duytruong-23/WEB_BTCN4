let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './src/app/db');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
let upload = multer({ storage: storage }).single('thumbnail');
module.exports = { upload };