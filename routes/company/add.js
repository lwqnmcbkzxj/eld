const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.post('/', async (req, res) => {    /* company_name, company_address, subscribe_type, company_timezone, contact_name, contact_phone, email, usdot, terminal_address_1, terminal_address_2 */
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            company_name: Joi.string().required(),
            company_address: Joi.string().required(),
            subscribe_type: Joi.string().valid('Basic'),
            company_timezone: Joi.number().min(1),
            contact_name: Joi.string(),
            contact_phone: Joi.string(),
            email: Joi.string().email(),
            usdot: Joi.number(),
            terminal_address_1: Joi.string(),
            terminal_address_2: Joi.string()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        const params = [ vars.company_name, null, null, null, vars.subscribe_type, vars.company_timezone, vars.contact_name,
            vars.contact_phone, vars.email, vars.usdot, vars.terminal_address_1, vars.terminal_address_2, 'ACTIVE'
        ];
        db = await mQuery(`insert into company
        (company_short_name, company_long_name, company_main_office_address, company_home_terminal_address, 
         company_subscribe_type, timezone_id, company_contact_name, company_contact_phone, company_email, company_usdot, 
         company_terminal_address_1, company_terminal_address_2, company_status) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const company_id = db.insertId;

    return res.status(201).send(makeResponse(0, { company_id: company_id }));
});


module.exports = router;