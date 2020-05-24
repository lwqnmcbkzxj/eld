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
        db = await mQuery(`select u.user_id, u.user_first_name, u.user_last_name, 
        concat(u.user_first_name, ' ', u.user_last_name) as user_full_name, u.user_login, u.user_phone,
        v.vehicle_external_id as vehicle_truck_number, u.user_notes, u.user_status, '3.2.9' as app_version,
       'Wireless Link/BL.02.48' as device_version
        from user u left join vehicle v on u.default_vehicle_id = v.vehicle_id
        where u.role_id = 1 and u.company_id = ?`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;