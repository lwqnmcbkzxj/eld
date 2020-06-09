const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.post('/:vehicle_id', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            vehicle_id: Joi.number().integer().min(1).required()
        });
        vars = await schema.validateAsync(req.params);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`update vehicle set vehicle_status = 'DEACTIVATED' where vehicle_id = ?`, [ vars.vehicle_id ]);
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;