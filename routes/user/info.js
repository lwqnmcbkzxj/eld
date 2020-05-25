const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils');
const Joi = require('@hapi/joi');

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;

    let db;
    try {
        db = await mQuery(`select user_id, user_remark from user where user_id = ?`, [req_user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    return res.status(200).send(makeResponse(0, db[0]));
});

router.get('/:user_id', async (req, res) => {
    let db, user_id;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1)
        });
        const vars = await schema.validateAsync({ user_id: req.params.user_id });
        user_id = vars.user_id;
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }


    try {
        db = await mQuery(`select u.user_id, u.user_remark, u.user_status, u.user_first_name, u.user_last_name,
        u.user_login, u.user_email, u.user_phone, u.user_driver_licence, u.issuing_state_id, ist.issuing_state_name, u.company_id,
        u.user_trailer_number, u.co_driver_id, u.role_id, cd.user_first_name, cd.user_last_name, ct.company_address_id, ct.company_address_text,
        u.timezone_id, tz.timezone_name, u.user_notes, u.user_personal_conveyance_flag, u.user_eld_flag, u.user_yard_move_flag,
        u.user_manual_drive_flag, u.default_vehicle_id, v.vehicle_id
        from user u left join issuing_state ist on u.issuing_state_id = ist.issuing_state_id
        left join user cd on u.user_id = cd.user_id
        left join company_address ct on u.company_terminal_id = ct.company_address_id
        left join timezone tz on u.timezone_id = tz.timezone_id
        left join vehicle v on u.default_vehicle_id = v.vehicle_id
        where u.user_id = ?`, [ user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n <= 0) return res.status(200).send(makeResponse(0, {}));

    return res.status(200).send(makeResponse(0, db[0]));
});

module.exports = router;