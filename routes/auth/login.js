const express = require('express');
const router = express.Router();

const { mQuery, makeResponse } = require('../../utils.js');
const crypto = require('crypto');
const md5 = require('md5');
const Joi = require('@hapi/joi');

router.post('/', async function(req, res) { /* user_login, user_password */
    let db_result, dres, session_db_ok, vars;
    try {
        const schema = Joi.object({
            user_login: Joi.string().required(),
            user_password: Joi.string().required(),
            is_web: Joi.number().integer().min(0).max(1)
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }
    const user_login = vars.user_login;
    const user_password = vars.user_password;
    const is_web = (vars.is_web) ? vars.is_web : 0;

    // if (!user_password) return res.status(400).send(makeResponse(1, 'Empty password received'));
    // if (!user_login) return res.status(400).send(makeResponse(2, 'Empty login received'));

    const user_password_hashed = md5(user_password);
    try {
        db_result = await mQuery('select user_id, user_login, user_password, role_id, company_id from user where user_login = ?',
            [user_login]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, 'Unexpected error while executing SELECT request'));
    }

    if (db_result.length <= 0) return res.status(404).send(makeResponse(6, 'User not found'));
    const user_info = db_result[0];
    if ((is_web === 0) && (user_info.role_id !== 1)) {
        return res.status(403).send(makeResponse(7, 'User has not enough rights to login'));
    }
    if ((is_web === 1) && (user_info.role_id === 1)) {
        return res.status(403).send(makeResponse(8, 'Driver cannot access web application'));
    }

    const db_password_hash = user_info.user_password;
    const user_id = user_info.user_id;
    if (db_password_hash.localeCompare(user_password_hashed)) {    // passwords not match
        return res.status(401).send(makeResponse(4, 'Wrong login / password'));
    }

    const buffer = crypto.randomBytes(20);
    const user_token = buffer.toString('hex');
    try {
        dres = await mQuery(`update user set user_token = ? where user_login = ?`, [user_token, user_login]);
    } catch (err) {
        return res.status(500).send(makeResponse(5, 'Unexpected error while updating database'));
    }

    try {
        session_db_ok = await mQuery(`select * from session where driver_user_id = ? and session_status = 'ACTIVE'`, [user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(6, err));
    }

    const session_len = session_db_ok.length;
    const session_id = (session_len <= 0) ? null : session_db_ok[0].session_id;
    console.log("Session ID: " + session_id);
    return res.header({token: user_token}).status(200).send(makeResponse(0, {
        login: user_login,
        token: user_token,
        user_id: user_id,
        role_id: user_info.role_id,
        company_id: user_info.company_id,
        session_id: session_id
    }));

});

module.exports = router;