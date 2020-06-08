const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');

router.get('/:company_id', async (req, res) => {
    const company_id = req.params.company_id;
    if (!company_id) return res.status(400).send(makeResponse(1, 'Empty company_id received'));

    let db;
    try {
        db = await mQuery(`select c.*, t.timezone_name, u.user_id, u.role_id as user_role_id
        from company c left join timezone t on c.timezone_id = t.timezone_id
        left join user u on c.company_id = u.company_id
        where c.company_id = ? and u.role_id = 3`, [company_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    let rs = db[0];
    db = null;
    try {
        db = await mQuery(`select * from company_address where company_id = ? 
                                and company_address_status <> 'DELETED'`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    rs['terminal_addresses'] = db.map(rec => { return {
        company_address_id: rec.company_address_id,
        company_address_type: rec.company_address_type,
        company_address_text: rec.company_address_text,
    };});

    return res.status(200).send(makeResponse(0, rs));
});

module.exports = router;