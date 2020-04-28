const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.patch('/', async (req, res) => {  /* record_id, location, remark, end_time */
    // const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    if (!session_id) return res.status(400).send(makeResponse(1, 'Empty session_id received'));

    let record_id, record_location, record_remark, end_time;
    try {
        record_id = parseInt(req.body.record_id);
        record_location = req.body.location;
        record_remark = req.body.remark;
        end_time = req.body.end_time;
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    let db;
    try {
        db = await mQuery(`select record_id from record where record_id = ? and record_status = 'ACTIVE'`, [record_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }
    if (db.length <= 0) return res.status(404).send(makeResponse(4, 'Could not find ACTIVE record with record_id = ' + record_id));


    try {
        let fields = [];
        let params = [];
        if (record_location) {
            fields.push('record_location = ?');
            params.push(record_location);
        }
        if (record_remark) {
            fields.push('record_remark = ?');
            params.push(record_remark);
        }
        if (end_time) {
            fields.push('record_end_dt = from_unixtime(floor(?/1000))');
            params.push(end_time);
        }
        const query = 'update record set ' + fields.join(', ') + ' where record_id = ?';
        console.log(query);
        params.push(record_id);
        db = await mQuery(query, params);
    } catch (err) {
        return res.status(500).send(makeResponse(5, err));
    }

    return res.status(200).send(makeResponse(0, {record_id: record_id}));
});


module.exports = router;