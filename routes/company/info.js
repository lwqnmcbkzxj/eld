const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/:company_id', async (req, res) => {
    const company_id = req.params.company_id;
    if (!company_id) return res.status(400).send(makeResponse(1, 'Empty company_id received'));

    let db;
    try {
        db = await mQuery(`select c.*, t.timezone_name
        from company c left join timezone t on c.timezone_id = t.timezone_id
        where company_id = ?`, [company_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    let rs = db[0];
    db = null;
    try {
        db = await mQuery(`select company_terminal_address from company_terminal where company_id = ?`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    rs['company_terminal_names'] = db.map(rec => { return rec.company_terminal_name; });

    return res.status(200).send(makeResponse(0, rs));
});

module.exports = router;