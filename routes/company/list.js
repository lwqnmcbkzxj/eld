const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/', async (req, res) => {
    let db = null;

    try {
        db = await mQuery(`select c.*, u.user_id, u.role_id as user_role_id from company c left join user u on c.company_id = u.company_id 
        where u.role_id = 3`, [ ]);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;