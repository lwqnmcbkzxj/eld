const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.post('/', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required(),
            serial_number: Joi.string().required(),
            note: Joi.string().required()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }
    console.log(vars);
    try {
        const params = [ vars.company_id, vars.serial_number, vars.note ];
        db = await mQuery(`insert into eld (company_id, eld_serial_number, eld_note) values (?, ?, ?)`, params);
    } catch (err) {
        return res.status(400).send(makeResponse(2, err));
    }

    return res.status(201).send(makeResponse(0, { eld_id: db.insertId }));
});

module.exports = router;