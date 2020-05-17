const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');
const multer = require('multer');

router.put('/', multer().none(), async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required(),
            company_name: Joi.string(),
            company_address: Joi.string(),
            subscribe_type: Joi.string().valid('BASIC', 'ADVANCED', 'PREMIUM'),
            company_timezone: Joi.string().valid('ALASKAN', 'CENTRAL', 'EASTERN', 'HAWAIIAN', 'PACIFIC'),
            contact_name: Joi.string(),
            contact_phone: Joi.string(),
            email: Joi.string().email(),
            usdot: Joi.number(),
            terminal_addresses: Joi.array().items(Joi.string()).required(),
            company_status: Joi.string().valid('ACTIVE', 'DELETED')
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    let timezone_id = null;
    if (!vars.company_timezone.localeCompare('ALASKAN')) timezone_id = 1;
    else if (!vars.company_timezone.localeCompare('CENTRAL')) timezone_id = 2;
    else if (!vars.company_timezone.localeCompare('EASTERN')) timezone_id = 3;
    else if (!vars.company_timezone.localeCompare('HAWAIIAN')) timezone_id = 4;
    else if (!vars.company_timezone.localeCompare('PACIFIC')) timezone_id = 5;
    else {
        return res.status(400).send(makeResponse(3, `Could not identify timezone_id by string constant \'${vars.company_timezone}\'`));
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
            params.push(timezone_id);
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
        if (vars.company_status) {
            params.push(vars.company_status);
            fields.push('company_status');
        }
        let str_arr = [];
        for (let i = 0; i < params.length; i++) {
            str_arr.push(fields[i] + " = ?");
        }
        const query = `update company set ${str_arr.join(',')} where company_id = ?`;
        params.push(vars.company_id);
        db = await mQuery(query, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const n = db.changedRows;
    // company table is now updated
    // continue update 'company_terminal' table

    db = null;
    // hard delete all addresses
    try {
        db = await mQuery(`delete from company_terminal where company_id = ?`, [ vars.company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    // add all terminal addresses
    db = null;
    Promise.all(vars.terminal_addresses.map(async terminal_address => {
        try {
            const params = [ vars.company_id, terminal_address ];
            db = await mQuery(`insert into company_terminal (company_id, company_terminal_address) values (?, ?)`, params);
            // terminal_ids_ok.push(db.insertId);
            return { company_terminal_address: terminal_address, company_terminal_id: db.insertId };
        } catch (err) {
            return { company_terminal_address: terminal_address, message: err};
        }
    }))
        .then(terminal_addresses => {
            return res.status(200).send(makeResponse(0, {
                changedRows: n,
                terminal_addresses: terminal_addresses
            }))
        .catch(err => {
            return res.status(500).send(makeResponse(4, err));
        });
    });

});


module.exports = router;