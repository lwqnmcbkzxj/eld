const router = require('express').Router();
const { mQuery, makeResponse, makeDay } = require('../../utils');
const Joi = require('@hapi/joi');

router.get('/:date/:days/', async (req, res) => {
    let db, vars;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1),
            date: Joi.string().required(),
            days: Joi.number().integer().min(1).required()
        });
        vars = await schema.validateAsync({
            user_id: req.body.user_id,
            date: req.params.date,
            days: req.params.days
        });
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const req_user_id = (vars.user_id) ? vars.user_id : req.auth_info.req_user_id;
    const date_str = req.params.date;
    const days_amount = req.params.days;
    if (days_amount <= 0) return res.status(400).send(makeResponse(3, 'Received incorrect days_amount'));
    const ms_in_day = 24*60*60*1000;
    const sec_in_day = ms_in_day / 1000;
    let result = [];

    const date_end = new Date(Date.parse(date_str) + ms_in_day);
    const date_start = new Date(Date.parse(date_str) - (days_amount - 1)* ms_in_day);

    // console.log(date_start + ":" + date_end);
    let ds = date_start;
    let ii = 0;
    let mapDateToIndex = {};
    while (ds < date_end) {
        const md = makeDay(ds);
        result.push({ day: md, has_inspection: 0, has_signature: 0, on_duty_seconds: 0, has_records: 0,
            distance: 201.3, has_violation_11h: 0, has_violation_14h: 0, has_violation_70h: 0,
            has_shipping_doc: 0
        });
        ds = new Date(ds.getTime() + ms_in_day);
        mapDateToIndex[md] = ii;
        ii++;
    }

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

    // check for violation (hours of service)
    try {
        const params = [ req_user_id, date_start, date_end ];
        db = await mQuery(`select count(violation_id) as amount_of_violations, violation_type, 
       date_format(violation_created_at, '%Y-%m-%d') as violation_date from violation where 
        violation_status = 'ACTIVE' and user_id = ? 
    and violation_created_at >= ? and violation_created_at < ? group by violation_type, violation_date`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    db.forEach((rec) => {
        if (rec.amount_of_violations > 0) {
            const index = mapDateToIndex[rec.violation_date];
            if (!rec.violation_type.localeCompare('11h')) result[index].has_violation_11h = 1;
            if (!rec.violation_type.localeCompare('14h')) result[index].has_violation_14h = 1;
            if (!rec.violation_type.localeCompare('70h')) result[index].has_violation_70h = 1;
        }
    });
    db = null;

    // get info about shipping documents
    try {
        const params = [ req_user_id ];
        db = await mQuery(`select u.user_id, ssd.session_shipping_document_dt, ssd.shipping_document_deleted_dt,
            ssd.session_shipping_document_status, ssd.session_shipping_document_id
            from session_shipping_document ssd left join session s on ssd.session_id = s.session_id 
            left join user u on s.driver_user_id = u.user_id 
            where u.user_id = ?
        `, params);
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    console.log(db);
    db.forEach((rec) => {
        const dt1 = new Date(Date.parse(makeDay(rec.session_shipping_document_dt)));
        const dt2 = (rec.shipping_document_deleted_dt != null) ? new Date(rec.shipping_document_deleted_dt) : new Date();
        // console.log(rec.session_shipping_document_id + " : " + dt1 + " : " + dt2 + " : " + typeof rec.shipping_document_deleted_dt);
        let dt = dt1;
        while (dt <= dt2) {
            const d_str = makeDay(dt);
            // console.log(d_str);
            const index_in_result = mapDateToIndex[d_str];
            if (index_in_result !== undefined) {
                result[index_in_result].has_shipping_doc = 1;
            }
            dt = new Date(dt.getTime() + ms_in_day);
        }
        // console.log("*********");
    });
    console.log(mapDateToIndex);
    // calculate driving hours

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