const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse } = require('../../utils');
const body_parser = require('body-parser').urlencoded({ extended: false });

router.put('/', body_parser, async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            user_id: Joi.number().integer().min(1).required(),
            user_first_name: Joi.string(),
            user_last_name: Joi.string()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        let strs = [], params = [];
        if (vars.user_first_name) {
            strs.push('user_first_name = ?');
            params.push(vars.user_first_name);
        }
        if (vars.user_last_name) {
            strs.push('user_last_name = ?');
            params.push(vars.user_last_name);
        }
        params.push(vars.user_id);
        const query = `update user set ${strs.join(',')} where user_id = ? limit 1`;
        db = await mQuery(query, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, {changedRows: db.changedRows}));
});

module.exports = router;