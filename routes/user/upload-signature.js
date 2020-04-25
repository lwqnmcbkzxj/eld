const router = require('express').Router();
const { mQuery, makeResponse, sessionExtracter, genRandomFileName } = require('./../../utils');
const fs = require('fs');

let multer = require('multer');
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/var/www/api.eld.sixhands.co/uploads/');
    },
    filename: function(req, file, cb) {
        // console.log(file);
        const arr = file.originalname.split('.');
        const dimention = arr[arr.length - 1];
        const new_file_name = genRandomFileName();
        cb(null, new_file_name + "." + dimention);
    }
});
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});


router.use('/', sessionExtracter);

router.post('/', upload.single('signature'), async (req, res) => {   /* signature */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const signature = req.file;
    if (!signature) return res.send(400).send(makeResponse(1, 'Empty signature received'));

    const file_path = signature.path;
    console.log(file_path);
    // const file_exists = await fs.access(file_path, );
    // console.log(file_exists);

    let db;
    try {
        db = await mQuery(`insert into signature(signature_user_id, signature_src, session_id) values 
            (?, ?, ?)`, [req_user_id, file_path, session_id]);
    } catch (err) {
        return res.send(500).send(makeResponse(2, err));
    }

    const signature_id = db.insertId;
    return res.status(200).send(makeResponse(0, {session_id: session_id, signature_id: signature_id}));
});

module.exports = router;