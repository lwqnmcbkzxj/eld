const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/:date', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const date = req.params.date;
    let has_inspection, has_signature, on_duty_time_seconds;

    let db;
    try {
        db = await mQuery(`select count(signature_id) as amount, signature_type from signature where 
          date_format(signature_dt, '%Y-%m-%d') = ? and signature_user_id = ? group by signature_type`, [ date, req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    if (db.length === 0) {
        has_inspection = false;
        has_signature = false;
    } else if (db.length === 1) {
        if (!db[0].signature_type.localeCompare('DVIR')) {
            has_inspection = true;
            has_signature = false;
        } else if (!db[0].signature_type.localeCompare('REGULAR')) {
            has_inspection = false;
            has_signature = true;
        }
    } else if (db.length === 2) {
        has_inspection = true;
        has_signature = true;
    }

    try {
        db = await mQuery(`select record_id, record_type, unix_timestamp(record_start_dt) as record_start_dt, unix_timestamp(record_end_dt) as record_end_dt 
            from record where record_status <> 'DELETED' and driver_user_id = ? and record_type in ('DRIVING', 'ON_DUTY', 'ON_DUTY_YM') and 
            (((date_format(record_start_dt, '%Y-%m-%d') <= ?) and (date_format(record_end_dt, '%Y-%m-%d') >= ?)) or 
             ((date_format(record_start_dt, '%Y-%m-%d') <= ?) and (record_end_dt is null)))`, [req_user_id, date, date, date]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const cur_dt = Math.round(Date.now() / 1000);
    const delta_time = db.map(rec => {
        if (rec.record_end_dt == null) return cur_dt - rec.record_start_dt;
        else return rec.record_end_dt - rec.record_start_dt;
    }).reduce((a, b) => a + b, 0);

    return res.status(200).send(makeResponse(0, {
        has_inspection: has_inspection ? 1 : 0,
        has_signature: has_signature ? 1 : 0,
        on_duty_seconds: delta_time
    }));
});

module.exports = router;