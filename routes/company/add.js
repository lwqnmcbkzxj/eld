const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');
const multer = require('multer');
const md5 = require('md5');

getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

router.post('/', multer().none(), async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            company_name: Joi.string().required(),
            company_address: Joi.string().required(),
            subscribe_type: Joi.string().valid('BASIC', 'ADVANCED', 'PREMIUM'),
            company_timezone: Joi.number().valid('ALASKAN', 'CENTRAL', 'EASTERN', 'HAWAIIAN', 'PACIFIC'),
            company_contact_name: Joi.string(),
            company_contact_phone: Joi.string(),
            email: Joi.string().email(),
            usdot: Joi.number(),
            terminal_addresses: Joi.array().items(Joi.string()).required()
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
        const params = [ vars.company_name, null, vars.company_address, null, vars.subscribe_type, timezone_id, vars.company_contact_name,
            vars.company_contact_phone, vars.email, vars.usdot, 'ACTIVE'
        ];
        db = await mQuery(`insert into company
        (company_short_name, company_long_name, company_main_office_address, company_home_terminal_address, 
         company_subscribe_type, timezone_id, company_contact_name, company_contact_phone, company_email, company_usdot, 
         company_status) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    const company_id = db.insertId;
    db = null;

    try {
        const user_login = `u` + getRandomInt(1000000, 9999999).toString();
        const role_id = 3;
        const user_password = md5('Qq123456');
        const params = [ role_id, company_id, user_login, user_password ];
        db = await mQuery(`insert into user (role_id, company_id, user_login, user_password) 
            values (?, ?, ?, ?)`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }
    const new_user_id = db.insertId;

    Promise.all(vars.terminal_addresses.map(async terminal_address => {
        try {
            const params = [ company_id, terminal_address ];
            db = await mQuery(`insert into company_address (company_id, company_address_text) values (?, ?)`, params);
            // terminal_ids_ok.push(db.insertId);
            return { company_terminal_address: terminal_address, company_terminal_id: db.insertId };
        } catch (err) {
            return { company_terminal_address: terminal_address, message: err};
        }
    }))
        .then(terminal_addresses => {
        return res.status(201).send(makeResponse(0, {
            company_id: company_id,
            user_id: new_user_id,
            terminal_addresses: terminal_addresses
        }))
        .catch(err => {
            return res.status(500).send(makeResponse(4, err));
        });
    });
});


module.exports = router;