const router = require('express').Router();
const Joi = require('@hapi/joi');
const md5 = require('md5');
const { mQuery, makeResponse } = require('../../utils');
const body_parser = require('body-parser').urlencoded();

router.put('/', body_parser, async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().min(6).required(),
            new_password_confirmation: Joi.string().min(6).required()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    if (vars.new_password.localeCompare(vars.new_password_confirmation)) {
        return res.status(403).send(makeResponse(4, 'Passwords are not equal'));
    }

    try {
        db = await mQuery(`select user_password from user where user_id = ?`, [ req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }
    if (db[0].user_password.localeCompare(md5(vars.old_password))) {
        return res.status(403).send(makeResponse(3, { text: 'Wrong old password received'}));
    }
    db = null;

    try {
        const new_password_hash = md5(vars.new_password);
        db = await mQuery(`update user set user_password = ? where user_id = ?`, [ new_password_hash, req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, {changedRows: db.changedRows}));
});

module.exports = router;