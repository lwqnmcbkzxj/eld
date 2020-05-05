const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;

    // find link to last signature
    let db;
    try {
        db = await mQuery(`select signature_src, signature_status from signature where signature_user_id = ? and signature_type = 'REGULAR'
            order by signature_id desc limit 1`,
            [req_user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }
    if (db.length <= 0) return res.status(404).send(makeResponse(2, 'No signature found'));
    if (!db[0].signature_status.localeCompare('DELETED')) return res.status(404).send(makeResponse(3, 'No signature found - last one was deleted'));
    const file_path = db[0].signature_src;
    return res.download(file_path);
    // return res.send(makeResponse(0, file_path));
});

router.get('/:date', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const date = req.params.date;

    // find link to last signature
    let db;
    try {
        db = await mQuery(`select signature_src, signature_status from signature where signature_user_id = ? and signature_type = 'REGULAR'
            and date_format(signature_dt, '%Y-%m-%d') = ? order by signature_id desc limit 1`, [ req_user_id, date ]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }
    if (db.length <= 0) return res.status(404).send(makeResponse(2, 'No signature found'));
    if (!db[0].signature_status.localeCompare('DELETED')) return res.status(404).send(makeResponse(3, 'No signature found - last one was deleted'));
    const file_path = db[0].signature_src;
    return res.download(file_path);
    // return res.send(makeResponse(0, file_path));
});

module.exports = router;