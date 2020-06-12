const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.post('/', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            violation_type: Joi.string().valid('11h', '14h', '70h').required(),
            violation_created_at: Joi.string(),
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;

    try {
        const params = [ vars.violation_created_at, req_user_id, session_id, vars.violation_type ];
        db = await mQuery(`insert into violation (violation_created_at, user_id, session_id, 
           violation_type) values (?, ?, ?, ?)`, params);
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, { violation_id: db.insertId }));
});

module.exports = router;