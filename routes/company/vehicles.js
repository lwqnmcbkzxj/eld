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
        db = await mQuery(`select vehicle_id, vehicle_status, vehicle_external_id from vehicle 
        where company_id = ? and vehicle_status <> 'DELETED'`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;