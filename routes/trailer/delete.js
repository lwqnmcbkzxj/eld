const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.delete('/', async (req, res) => {    /* session_trailer_id */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const session_trailer_id = req.body.session_trailer_id;

    if (!session_trailer_id) return res.status(400).send(makeResponse(1, 'Empty session_trailer_id'));

    let db;
    try{
        db = await mQuery(`update session_trailer set session_trailer_status = 'DELETED' where session_trailer_id = ?`, [session_trailer_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const n = db.changedRows;

    return res.status(200).send(makeResponse(0, {amount_of_deleted_records: n}));
});

module.exports = router;