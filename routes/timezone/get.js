const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/', async (req, res) => {
    let db;

    try {
        db = await mQuery(`select * from timezone`);
    } catch (err) {
        return res.stat(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;