const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils')

router.get('/:company_id', async (req, res) => {
    const company_id = req.params.company_id;
    if (!company_id) return res.status(400).send(makeResponse(1, 'Empty company_id received'));

    let db;
    try {
        db = await mQuery(`select company_id, company_short_name, company_long_name,
            company_home_terminal_address, company_main_office_address from company where company_id = ?`, [company_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    return res.status(200).send(makeResponse(0, db[0]));
});

module.exports = router;