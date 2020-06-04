const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/', async (req, res) => {
    let db = null;

    try {
        db = await mQuery(`select * from company`, [ ]);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;