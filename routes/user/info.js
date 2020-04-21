const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils')

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;

    let db;
    try {
        db = await mQuery(`select user_id, user_remark from user where user_id = ?`, [req_user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    return res.status(200).send(makeResponse(0, db[0]));
});

module.exports = router;