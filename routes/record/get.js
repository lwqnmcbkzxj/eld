const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.get('/', async (req, res) => {  /* */
    const req_user_id = req.auth_info.req_user_id;

    let db;
    try {
        db = await mQuery(`select record_id, record_type, record_sub_type, record_location, record_remark, record_start_dt, record_end_dt 
            from record where record_status = 'ACTIVE' and driver_user_id = ?`, [ req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});


module.exports = router;