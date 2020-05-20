const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');
const Joi = require('@hapi/joi');

router.patch('/:company_id', async (req, res) => {
    let db, company_id;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1)
        });
        const vars = await schema.validateAsync({ company_id: req.params.company_id });
        company_id = vars.company_id;
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`update company set company_status = 'DELETED' where company_id = ?`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;