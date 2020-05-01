const express = require('express');
const router = express.Router();

const { makeQuery, makeResponse } = require('../../utils.js');
const crypto = require('crypto');
const md5 = require('md5');

router.post('/', function(req, res) { /* user_login, user_password */
    // console.log(req.body);
    const user_login = req.body.user_login;
    const user_password = req.body.user_password;
    if (!user_password) return res.status(400).send(makeResponse(1, 'Empty password received'));
    if (!user_login) return res.status(400).send(makeResponse(2, 'Empty login received'));

    const user_password_hashed = md5(user_password);
    makeQuery('select user_id, user_login, user_password, role_id, company_id from user where user_login = ?',
        [user_login], (db_result) => {

        if (db_result.result.length <= 0) return res.status(404).send(makeResponse(6, 'User not found'));
        const user_info = db_result.result[0];
        const db_password_hash = user_info.user_password;
        const user_id = user_info.user_id;
        if (!db_password_hash.localeCompare(user_password_hashed)) {    // passwords match
            const buffer = crypto.randomBytes(20);
            const user_token = buffer.toString('hex');
            // console.log(user_token);
            makeQuery(`update user set user_token = ? where user_login = ?`, [user_token, user_login], (dres) => {
                makeQuery(`select * from session where driver_user_id = ? and session_status = 'ACTIVE'`, [user_id],
                    (session_db_ok) => {
                        const session_len = session_db_ok.result.length;
                        const session_id = (session_len <= 0) ? null : session_db_ok.result[0].session_id;
                        console.log("Session ID: " + session_id);
                        return res.header({token: user_token}).status(200).send(makeResponse(0, {
                            login: user_login,
                            token: user_token,
                            role_id: user_info.role_id,
                            company_id: user_info.company_id,
                            session_id: session_id
                        }));
                    }, (session_db_err) => {
                        return res.status(500).send(makeResponse(6, session_db_err));
                    }
                );
            }, (dres) => {
                // console.log(dres);
                return res.status(500).send(makeResponse(5, 'Unexpected error while updating database'));
            });
        } else {
            return res.status(401).send(makeResponse(4, 'Wrong login / password'));
        }

    }, (res) => {
        return res.status(500).send(makeResponse(3, 'Unexpected error while executing SELECT request'));
    });
});

module.exports = router;