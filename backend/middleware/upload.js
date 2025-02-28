const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.xlsx') {
            return cb(new Error('Solo archivos Excel (.xlsx) permitidos'));
        }
        cb(null, true);
    }
});

module.exports = upload;
