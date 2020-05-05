const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.get('/:date', async (req, res) => {  /* */
    const req_user_id = req.auth_info.req_user_id;
    const date = req.params.date;

    let db;
    try {
        const params = [ req_user_id, date ];
        db = await mQuery(`select signature_id, signature_dt, signature_type, session_id from signature 
            where signature_user_id = ? and signature_status <> 'DELETED' and date_format(signature_dt, '%Y-%m-%d') = ? 
            and signature_type = 'REGULAR' order by signature_dt desc`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

router.get('/', async (req, res) => {  /* */
    return res.status(501).send(makeResponse(1, 'Not implemented'));
});

module.exports = router;