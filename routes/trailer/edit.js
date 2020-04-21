const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.patch('/', async (req, res) => {     /* session_trailer_id, new_external_trailer_id */
    const session_trailer_id = req.body.session_trailer_id;
    const new_external_trailer_id = req.body.new_name;
    if (!session_trailer_id) return res.status(400).send(makeResponse(1, 'Empty session_trailer_id'));
    if (!new_external_trailer_id) return res.status(400).send(makeResponse(2, 'Empty new_external_trailer_id'));

    // determine trailer_id
    let trailer_id = null;
    try {
        const db = await mQuery(`select trailer_id from session_trailer where session_trailer_id = ?`, [session_trailer_id]);
        const n = db.length;
        if (n <= 0) return res.status(404).send(makeResponse(4, 'Object to edit was not found'));
        trailer_id = db[0].trailer_id;
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    try {
        const db = await mQuery(`update trailer set trailer_external_id = ? where trailer_id = ?`, [new_external_trailer_id, trailer_id]);
        const n = db.changedRows;
        if (n <= 0) return res.status(200).send(makeResponse(5, 'Warning while updating trailer_id = ' + trailer_id + '. Nothing updated'));
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    return res.status(200).send(makeResponse(0, {
        session_trailer_id: session_trailer_id,
        trailer_id: trailer_id,
        new_external_trailer_id: new_external_trailer_id
    }));
});

module.exports = router;