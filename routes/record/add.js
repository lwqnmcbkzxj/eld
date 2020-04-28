const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.post('/', async (req, res) => {  /* type, location, remark, start_time, end_time */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    if (!session_id) return res.status(400).send(makeResponse(1, 'Empty session_id received'));

    let start_dt = parseInt(req.body.start_time);
    let end_dt = parseInt(req.body.end_time);
    if (!end_dt) end_dt = null;
    const record_type = parseInt(req.body.type);
    if (record_type <= 0) return res.status(400).send(makeResponse(4, 'Incorrect type: ' + record_type + ' received'));
    const record_location = req.body.location;
    const record_remark = req.body.remark;

    let db;
    try {
        const params = [req_user_id, session_id, record_type, record_location, record_remark, start_dt, end_dt];
        console.log(params);
        db = await mQuery(`insert into record(driver_user_id, session_id, record_type, record_location, record_remark, record_start_dt, record_end_dt) values 
            (?, ?, ?, ?, ?, from_unixtime(floor(?/1000)), from_unixtime(floor(?/1000)))`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const record_id = db.insertId;
    if (!record_id) return res.status(500).send(makeResponse(3, 'Could not insert new record to database'));

    return res.status(200).send(makeResponse(0, {record_id: record_id, session_id: session_id}));
});


module.exports = router;