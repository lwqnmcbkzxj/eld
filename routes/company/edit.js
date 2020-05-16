const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');

router.put('/', async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required(),
            company_name: Joi.string(),
            company_address: Joi.string(),
            subscribe_type: Joi.string().valid('Basic'),
            company_timezone: Joi.number().min(1),
            contact_name: Joi.string(),
            contact_phone: Joi.string(),
            email: Joi.string().email(),
            usdot: Joi.number(),
            terminal_address_1: Joi.string(),
            terminal_address_2: Joi.string(),
            company_status: Joi.string().valid('ACTIVE', 'DELETED')
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        let params = [], fields = [];
        if (vars.company_name) {
            params.push(vars.company_name);
            fields.push('company_short_name');
        }
        if (vars.subscribe_type) {
            params.push(vars.subscribe_type);
            fields.push('company_subscribe_type');
        }
        if (vars.company_address) {
            params.push(vars.company_address);
            fields.push('company_main_office_address');
        }
        if (vars.company_timezone) {
            params.push(vars.company_timezone);
            fields.push('timezone_id');
        }
        if (vars.contact_name) {
            params.push(vars.contact_name);
            fields.push('company_contact_name');
        }
        if (vars.contact_phone) {
            params.push(vars.contact_phone);
            fields.push('company_contact_phone');
        }
        if (vars.email) {
            params.push(vars.email);
            fields.push('company_email');
        }
        if (vars.usdot) {
            params.push(vars.usdot);
            fields.push('company_usdot');
        }
        if (vars.terminal_address_1) {
            params.push(vars.terminal_address_1);
            fields.push('company_terminal_address_1');
        }
        if (vars.terminal_address_2) {
            params.push(vars.terminal_address_2);
            fields.push('company_terminal_address_2');
        }
        if (vars.company_status) {
            params.push(vars.company_status);
            fields.push('company_status');
        }
        let str_arr = [];
        for (let i = 0; i < params.length; i++) {
            str_arr.push(fields[i] + "= ?");
        }
        const query = `update company set ${str_arr.join(',')} where company_id = ?`;
        params.push(vars.company_id);
        db = await mQuery(query, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.changedRows;
    return res.status(200).send(makeResponse(0, {'changedRows': n}));
});


module.exports = router;