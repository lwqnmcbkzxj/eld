const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.get('/:eld_id', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            eld_id: Joi.number().integer().required()
        });
        vars = await schema.validateAsync(req.params);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`select * from eld where eld_id = ?`, [ vars.eld_id ]);
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;