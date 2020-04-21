const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.post('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const trailer_external_id = req.body.trailer_name;

    if (!trailer_external_id) return res.send(400).send(makeResponse(5, 'Empty trailer_name received'));

    // check if 'trailer_external_id' already exists
    try {
        const db_trail = await mQuery(`select * from trailer where trailer_external_id = ?`, [trailer_external_id]);
        const n = db_trail.lenght;
        if (n > 0) return res.status(409).send(makeResponse(2, 'Trailer with name ' + trailer_external_id + ' already exists'));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    // add new trailer
    let trailer_id = null;
    try {
        const db = await mQuery(`insert into trailer(trailer_external_id, creator_user_id) values (?, ?)`,
            [trailer_external_id, req_user_id]);
        trailer_id = db.insertId;
    } catch (err2) {
        const db = await mQuery(`select trailer_id from trailer where trailer_external_id = ?`, [trailer_external_id]);
        // console.log(db);
        trailer_id = db[0].trailer_id;
    }

    // add new (session_id, trailer_id)
    try {
        const db = await mQuery(`insert into session_trailer(session_id, trailer_id) VALUES (?, ?)`, [session_id, trailer_id]);
        const session_trailer_id = db.insertId;
        return res.status(201).send(makeResponse(0, {
            session_id: session_id,
            trailer_id: trailer_id,
            trailer_external_id: trailer_external_id,
            session_trailer_id: session_trailer_id
        }));
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }
});


module.exports = router;