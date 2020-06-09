const router = require('express').Router();
const Joi = require('@hapi/joi');
const md5 = require('md5');
const { mQuery, makeResponse } = require('../../utils');
const body_parser = require('body-parser').urlencoded({ extended: false });

router.patch('/', body_parser, async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1),
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
            new_password_confirmation: Joi.string().required()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const req_user_id = (vars.user_id) ? vars.user_id : req.auth_info.req_user_id;

    if (vars.new_password.localeCompare(vars.new_password_confirmation)) {
        return res.status(403).send(makeResponse(4, 'Passwords are not equal'));
    }

    try {
        db = await mQuery(`select user_id from user where user_id = ?`, [ req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(5, err));
    }
    if (db.length <= 0) return res.status(500).send(makeResponse(4, 'User with user_id = ' + req_user_id + ' does not exist'));
    db = null;

    if (!vars.user_id) {    // if change password for this user (identified by token)
        try {
            db = await mQuery(`select user_password from user where user_id = ?`, [ req_user_id ]);
        } catch (err) {
            return res.status(500).send(makeResponse(2, err));
        }

        if (db[0].user_password.localeCompare(md5(vars.old_password))) {
            return res.status(403).send(makeResponse(3, { text: 'Wrong old password received'}));
        }
        db = null;
    }

    try {
        const new_password_hash = md5(vars.new_password);
        db = await mQuery(`update user set user_password = ? where user_id = ?`, [ new_password_hash, req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, {changedRows: db.changedRows, user_id: req_user_id }));
});

module.exports = router;