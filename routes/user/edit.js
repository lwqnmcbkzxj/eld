const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse, makeUpdateString } = require('../../utils');
const body_parser = require('body-parser').urlencoded({ extended: false });
const md5 = require('md5');

router.patch('/', body_parser, async (req, res) => {
    let db, vars;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1).required(),
            user_first_name: Joi.string().min(2),
            user_last_name: Joi.string().min(2),
            user_login: Joi.string().min(6),
            user_password: Joi.string().min(6),
            role_id: Joi.number().integer().min(1),
            company_id: Joi.number().integer().min(1),
            user_email: Joi.string().email(),
            user_phone: Joi.string().min(6),
            user_driver_licence: Joi.string(),
            issuing_state_id: Joi.number().integer().min(1),
            vehicle_id: Joi.number().integer().min(1),
            user_trailer_number: Joi.number().integer().min(1),
            co_driver_id: Joi.number().integer().min(1),
            company_address_id: Joi.number().integer().min(1),
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

    if (vars.user_login) {
        try {
            db = await mQuery(`select user_id from user where user_login = ?`, [ vars.user_login ]);
        } catch (err) {
            return res.status(500).send(makeResponse(3, err));
        }
        if ((db.length > 0) && (db[0].user_id !== vars.user_id)) {
            return res.status(403).send(makeResponse(4, 'User with login ' + vars.user_login + ' already exists'));
        }
    }
    console.log(vars);
    // console.log(vars);
    try {
        const password_hash = vars.user_password ? md5(vars.user_password) : null;
        const fields = ['role_id', 'company_id', 'user_login', 'user_password', 'user_remark', 'user_first_name',
            'user_last_name', 'user_personal_conveyance_flag', 'user_eld_flag', 'user_yard_move_flag',
            'user_manual_drive_flag', 'user_email', 'user_phone', 'user_trailer_number', 'co_driver_id',
            'timezone_id', 'company_terminal_id', 'user_notes', 'user_driver_licence', 'issuing_state_id', 'default_vehicle_id'
        ];
        const values = [ vars.role_id, vars.company_id, vars.user_login, password_hash, vars.user_remark,
            vars.user_first_name, vars.user_last_name, vars.user_personal_conveyance_flag, vars.user_eld_flag,
            vars.user_yard_move_flag, vars.user_manual_drive_flag, vars.user_email, vars.user_phone,
            vars.user_trailer_number, vars.co_driver_id, vars.timezone_id, vars.company_address_id,
            vars.user_notes, vars.user_driver_licence, vars.issuing_state_id, vars.vehicle_id
        ];
        const { params, update } = makeUpdateString(fields, values);
        params.push(vars.user_id);
        if (update.length <= 3) {
            return res.status(200).send(makeResponse(2, { changedRows: 0 }));
        }
        db = await mQuery(`update user set ${update} where user_id = ?`, params);
    } catch (err) {
        console.log(err.toString());
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(201).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;