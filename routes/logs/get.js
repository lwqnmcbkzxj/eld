const router = require('express').Router();
const { mQuery, makeResponse, makeDay } = require('../../utils');

router.get('/:date/:days', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const date_str = req.params.date;
    const days_amount = req.params.days;
    if (days_amount <= 0) return res.status(400).send(makeResponse(3, 'Received incorrect days_amount'));
    const ms_in_day = 24*60*60*1000;
    const sec_in_day = ms_in_day / 1000;
    let result = [];

    const date_end = new Date(Date.parse(date_str) + ms_in_day);
    const date_start = new Date(Date.parse(date_str) - (days_amount - 1)* ms_in_day);

    console.log(date_start + ":" + date_end);
    let ds = date_start;
    while (ds < date_end) {
        const md = makeDay(ds);
        result.push({ day: md, has_inspection: 0, has_signature: 0, on_duty_seconds: 0, has_records: 0 });
        ds = new Date(ds.getTime() + ms_in_day);
    }

    let db;
    try {
        const params = [ date_start - ms_in_day, date_end, req_user_id ];
        db = await mQuery(`select signature_id, signature_type, date_format(signature_dt, '%Y-%m-%d') as signature_day
            from signature where (signature_dt >= ? and signature_dt < ?) and signature_user_id = ? and signature_status <> 'DELETED'`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    db.forEach(rec => {
        const day = rec.signature_day;
        let i = 0;
        while (i < result.length) {
            if (!result[i].day.localeCompare(day)) break;
            i++;
        }
        if (i < result.length) {
            if (!rec.signature_type.localeCompare('DVIR')) result[i].has_inspection = 1;
            if (!rec.signature_type.localeCompare('REGULAR')) result[i].has_signature = 1;
        }
    });

    try {
        db = await mQuery(`select record_id, record_type in ('ON_DUTY', 'DRIVING', 'ON_DUTY_YM') as record_type_ok,
            unix_timestamp(record_start_dt) as record_start_dt, date_format(record_start_dt, '%Y-%m-%d') as record_start_day,
            record_status from record where record_status <> 'DELETED' and driver_user_id = ? and 
            record_start_dt >= ? and record_start_dt <= ? order by record_start_dt`, [ req_user_id, date_start, date_end ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    // console.log(db);
    const cur_dt_unix = Math.round(Date.now() / 1000);
    const n = db.length;
    for (let i = 0; i < n; i++) {
        const day = db[i].record_start_day;     // day of record (when started)
        const next_day_unix = Math.round((Date.parse(day) + ms_in_day) / 1000);

        let j = 0;
        while (j < result.length) {
            if (!result[j].day.localeCompare(day)) break;
            j++;
        }
        if (j >= result.length) continue;
        // j points at result[j] element

        const day_has_records = (!db[i].record_status.localeCompare('ACTIVE')) ? 1 : 0;
        if (result[j].has_records === 0) {
            result[j].has_records = day_has_records;
        }

        if (db[i].record_type_ok === 1) {
            let start_dt_unix = db[i].record_start_dt;
            let end_dt_unix;        // end of record
            if (i >= db.length - 1) end_dt_unix = Math.min(cur_dt_unix, next_day_unix);
            else end_dt_unix = db[i+1].record_start_dt;

            // we have period [ start_dt_unix, end_dt_unix ]

            if (end_dt_unix < next_day_unix) {  // все в рамках одного дня
                result[j].on_duty_seconds += end_dt_unix - start_dt_unix;
            } else {        // есть переход через день
                result[j].on_duty_seconds += next_day_unix - start_dt_unix;
                start_dt_unix = next_day_unix;
                if (j+1 < result.length) {
                    result[j+1].on_duty_seconds += end_dt_unix - start_dt_unix;
                }
            }
        }
    }

    return res.status(200).send(makeResponse(0, result));
});


module.exports = router;