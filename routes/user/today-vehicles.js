const router = require('express').Router();
const { mQuery, makeResponse, sessionExtracter } = require('./../../utils');

router.use('/', sessionExtracter);

router.get('/', async (req, res) => {   /* */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const dt = new Date();      // current date and time
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = dt.getFullYear();
    const cur_date = yyyy + '-' + mm + '-' + dd;
    // console.log(cur_date);
    if (!dt) return res.status(400).send(makeResponse(1, 'Empty dt found'));

    let db;
    try {
        db = await mQuery(`select * from session where (driver_user_id = ?) and ((date_format(session_start_dt, '%Y-%m-%d') <= ? and date_format(session_end_dt, '%Y-%m-%d') >= ?) or 
            (date_format(session_start_dt, '%Y-%m-%d') <= ? and session_status = 'ACTIVE') or (session_id = ?)) and (session_status <> 'DELETED')`, [req_user_id, cur_date, cur_date, cur_date, session_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    // console.log(db);
    if (db.length <= 0) return res.status(404).send(makeResponse(2, 'No session found in such period'));
    const vehicle_ids = db.map(rec => rec.vehicle_id);
    // console.log(vehicle_ids);
    const vehicle_ids_str = vehicle_ids.map(vehicle_id => vehicle_id.toString()).join(',');
    console.log(vehicle_ids_str);
    try {
        const query = `select * from vehicle where vehicle_id in (` + vehicle_ids_str + `)`;
        db = await mQuery(query, []);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;