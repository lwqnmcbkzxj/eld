const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');
const Joi = require('@hapi/joi');

router.patch('/:user_id', async (req, res) => {
    let db, user_id;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1)
        });
        const vars = await schema.validateAsync({ user_id: req.params.user_id });
        user_id = vars.user_id;
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`update user set user_status = 'ACTIVE' where user_id = ?`, [ user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;