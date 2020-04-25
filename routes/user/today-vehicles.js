const router = require('express').Router();
const { mQuery, makeResponse, sessionExtracter } = require('./../../utils');

router.use('/', sessionExtracter);

router.get('/', async (req, res) => {   /* */
    const session_id = req.auth_info.session_id;
    const dt = new Date();      // current date and time
    // console.log(dt);
    if (!dt) return res.status(400).send(makeResponse(1, 'Empty dt found'));

    let db;
    try {
        db = await mQuery(`select * from session where (session_start_dt <= ? and session_end_dt >= ?) or 
            (session_start_dt <= ? and session_end_dt is null) or (session_id = ?)`, [dt, dt, dt, session_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    if (db.length <= 0) return res.status(404).send(makeResponse(2, 'No session found in such period'));
    const vehicle_ids = db.map(rec => rec.vehicle_id);
    const vehicle_ids_str = vehicle_ids.map(vehicle_id => vehicle_id.toString()).join(',');
    try {
        db = await mQuery(`select * from vehicle where vehicle_id in (?)`, [vehicle_ids_str]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;