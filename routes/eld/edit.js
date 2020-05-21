const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse, makeUpdateString } = require('../../utils');

router.patch('/', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            eld_id: Joi.number().integer().required(),
            serial_number: Joi.string().required(),
            note: Joi.string().required()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const { params, update } = makeUpdateString([ 'eld_serial_number', 'eld_note' ], [ vars.serial_number, vars.note ]);
    params.push(vars.eld_id);

    try {
        db = await mQuery(`update eld set ${update} where eld_id = ?`, params);
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;