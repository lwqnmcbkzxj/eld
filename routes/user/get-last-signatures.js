const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;

    let db;
    try {
        // const query = `select date(signature_dt) as signature_day, signature_dt from signature where signature_user_id = ? and signature_dt >= date_sub(current_timestamp, interval 14 day) group by signature_day order by signature_day desc`;
        db = await mQuery(`select signature_id, signature_dt, date_format(signature_dt, '%Y-%m-%d') as signature_day 
            from signature where signature_user_id = ? and signature_dt >= date_sub(current_timestamp, interval 14 day) 
            and signature_status = 'ACTIVE' and signature_type = 'REGULAR' order by signature_dt desc`,[req_user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;