const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');
const Joi = require('@hapi/joi');

router.get('/:company_id', async (req, res) => {
    let db, company_id;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required(),
        });
        const vars = await schema.validateAsync(req.params);
        company_id = vars.company_id;
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`select user_id, user_first_name, user_last_name, 
        concat(user_first_name, ' ', user_last_name) as user_full_name from user 
        where role_id = 1 and user_status <> 'DELETED' and company_id = ?`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;