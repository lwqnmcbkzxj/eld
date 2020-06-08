const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');
const md5 = require('md5');
const Joi = require('@hapi/joi');
const body_parser = require('body-parser').urlencoded({ extended: false });

router.post('/', body_parser, async (req, res) => {
    let db, vars;
    try {
        const schema = Joi.object({
            user_first_name: Joi.string().min(2).required(),
            user_last_name: Joi.string().min(2).required(),
            user_login: Joi.string().min(6).required(),
            user_password: Joi.string().min(6).required(),
            role_id: Joi.number().integer().min(1).required(),
            company_id: Joi.number().integer().min(1).required(),
            user_email: Joi.string().email().allow(''),
            user_phone: Joi.string().min(6).required(),
            user_driver_licence: Joi.string().required(),
            issuing_state_id: Joi.number().integer().min(1).required(),
            vehicle_id: Joi.number().integer().min(1),
            trailer_number: Joi.number().integer().min(1),
            co_driver_id: Joi.number().integer().min(1),
            home_terminal_address_id: Joi.number().integer().min(1),
            timezone_id: Joi.number().integer().min(1),
            user_notes: Joi.string().allow(''),
            user_remark: Joi.string(),
            user_personal_conveyance_flag: Joi.number().integer().min(0).max(1),
            user_eld_flag: Joi.number().integer().min(0).max(1),
            user_yard_move_flag: Joi.number().integer().min(0).max(1),
            user_manual_drive_flag: Joi.number().integer().min(0).max(1)
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }
    // console.log(vars);
    try {
        const password_hash = md5(vars.user_password);
        const params = [ vars.role_id, vars.company_id, vars.user_login, password_hash, vars.user_remark,
            null, vars.user_first_name, vars.user_last_name, vars.user_personal_conveyance_flag, vars.user_eld_flag,
            vars.user_yard_move_flag, vars.user_manual_drive_flag, vars.user_email, vars.user_phone,
            vars.trailer_number, vars.co_driver_id, vars.timezone_id, vars.home_terminal_address_id,
            vars.user_notes, vars.user_driver_licence, vars.issuing_state_id, vars.vehicle_id
        ];
        const qustionMarks = params.map(() => { return '?'; }).join(", ");
        db = await mQuery(`insert into user(role_id, company_id, user_login, user_password, user_remark,
                 user_token, user_first_name, user_last_name, user_personal_conveyance_flag, user_eld_flag,
                 user_yard_move_flag, user_manual_drive_flag, user_email, user_phone, user_trailer_number, co_driver_id,
                 timezone_id, company_terminal_id, user_notes, user_driver_licence, issuing_state_id, default_vehicle_id) 
                 values (${qustionMarks})`, params);
    } catch (err) {
        console.log(err.toString());
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(201).send(makeResponse(0, { user_id: db.insertId }));
});

module.exports = router;