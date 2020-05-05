const router = require('express').Router();
const { mQuery, makeResponse, sessionExtracter, genRandomFileName, makeDay } = require('./../../utils');
const fs = require('fs');

let multer = require('multer');
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, global.app_root + '/uploads/');
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

router.post('/', upload.single('signature'), async (req, res) => {   /* signature, date (optional) */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const dt = (!req.body.date) ? makeDay(new Date()) : req.body.date;
    const signature = req.file;
    if (!signature) return res.send(400).send(makeResponse(1, 'Empty signature received'));

    const file_path = signature.path;

    let db;

    // soft delete all signatures
    try {
        db = await mQuery(`update signature set signature_status = 'DELETED' where 
            signature_status = 'ACTIVE' and signature_type = 'REGULAR' and 
            signature_user_id = ? and date_format(signature_dt, '%Y-%m-%d') = ?`, [ req_user_id, dt ]);
    } catch (err) {
        return res.send(500).send(makeResponse(3, err));
    }

    // upload new signature
    try {
        const query = `insert into signature(signature_user_id, signature_src, session_id, signature_type, signature_dt) values (?, ?, ?, ?, ?)`;
        const params = [ req_user_id, file_path, session_id, 'REGULAR', dt ];
        db = await mQuery(query, params);
    } catch (err) {
        return res.send(500).send(makeResponse(2, err));
    }

    const signature_id = db.insertId;
    return res.status(200).send(makeResponse(0, {session_id: session_id, signature_id: signature_id}));
});

module.exports = router;