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
            company_short_name: Joi.string().required(),
            company_main_office_address: Joi.string().required(),
            company_subscribe_type: Joi.string().valid('BASIC', 'ADVANCED', 'PREMIUM'),
            timezone_id: Joi.number().integer().min(1),
            company_contact_name: Joi.string(),
            company_contact_phone: Joi.string(),
            company_email: Joi.string().email(),
            company_usdot: Joi.number(),
            terminal_addresses: Joi.array().items(Joi.string())
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        const params = [ vars.company_short_name, null, vars.company_main_office_address, null, vars.company_subscribe_type, vars.timezone_id, vars.company_contact_name,
            vars.company_contact_phone, vars.company_email, vars.company_usdot, 'ACTIVE'
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
    })).then(terminal_addresses => {
        const ret_obj = {
            company_id: company_id,
            user_id: new_user_id,
            terminal_addresses: terminal_addresses
        };
        return res.status(201).send(makeResponse(0, ret_obj));
    }).catch(err => {
        return res.status(500).send(makeResponse(4, err));
    });
});


module.exports = router;