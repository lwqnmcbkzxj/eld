const router = require('express').Router();
const { mQuery, makeResponse, makeDay } = require('./../../utils');

router.get('/:date', async (req, res) => {  /* */
    const req_user_id = req.auth_info.req_user_id;
    const date = req.params.date;
    const ms_in_day = 24*60*60*1000;
    const date_last = makeDay(new Date(Date.parse(date) - ms_in_day));

    // console.log(date_last);
    // console.log(new Date());

    let db;
    try {
        const query1 = `(select record_id, record_type, record_sub_type, record_location, record_remark, record_start_dt, record_end_dt 
            from record where record_status = 'ACTIVE' and driver_user_id = ? and 
            ((date_format(record_start_dt, '%Y-%m-%d') <= ?) and (date_format(record_start_dt, '%Y-%m-%d') >= ?)))`;
        const query2 = `(select record_id, record_type, record_sub_type, record_location, record_remark, record_start_dt, record_end_dt 
            from record where record_status = 'ACTIVE' and driver_user_id = ? and 
            ((date_format(record_start_dt, '%Y-%m-%d') <= ?) and (date_format(record_start_dt, '%Y-%m-%d') >= ?)) order by record_start_dt desc limit 1)`;
        db = await mQuery(query2 + ' union all ' + query1, [ req_user_id, date_last, date_last, req_user_id, date, date ]);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});


module.exports = router;