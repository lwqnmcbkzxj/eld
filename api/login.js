const { makeQuery, makeResponse } = require('../utils.js');
const crypto = require('crypto');
const md5 = require('md5');

module.exports = function(req, res) { /* user_login, user_password */
    console.log(req.body);
    const user_login = req.body.user_login;
    const user_password = req.body.user_password;
    if (!user_password) return res.send(makeResponse(1, 'Empty password received'));
    if (!user_login) return res.send(makeResponse(2, 'Empty login received'));

    const user_password_hashed = md5(user_password);
    makeQuery('select user_login, user_password, role_id, company_id from user where user_login = ?',
        [user_login], (db_result) => {

        if (db_result.result.length <= 0) return res.send(makeResponse(6, 'User not found'));
        const user_info = db_result.result[0];
        const db_password_hash = user_info.user_password;
        if (!db_password_hash.localeCompare(user_password_hashed)) {    // passwords match
            const buffer = crypto.randomBytes(20);
            const user_token = buffer.toString('hex');
            console.log(user_token);
            makeQuery(`update user set user_token = ? where user_login = ?`, [user_token, user_login], (dres) => {
                return res.send(makeResponse(0, {
                    login: user_login,
                    token: user_token,
                    role_id: user_info.role_id,
                    company_id: user_info.company_id
                }));
            }, (dres) => {
                // console.log(dres);
                return res.send(makeResponse(5, 'Unexpected error while updating database'));
            });
        } else {
            return res.send(makeResponse(4, 'Wrong login / password'));
        }

    }, (res) => {
        return res.send(makeResponse(3, 'Unexpected error while executing SELECT request'));
    });

};