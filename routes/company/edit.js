const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse, makeUpdateString } = require('../../utils');

router.patch('/', require('express').json(), async (req, res) => {
    let vars = {}, db = null;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required(),
            company_name: Joi.string(),
            company_address: Joi.string(),
            subscribe_type: Joi.string().valid('BASIC', 'ADVANCED', 'PREMIUM'),
            company_timezone: Joi.number().integer().min(1),
            contact_name: Joi.string(),
            contact_phone: Joi.string(),
            email: Joi.string().email(),
            usdot: Joi.number().integer(),
            terminal_addresses: Joi.array().items({
                company_address_id: Joi.number().integer().min(1),
                company_address_text: Joi.string(),
            }).required()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const company_id = vars.company_id;
    const fields = [ 'company_short_name', 'company_subscribe_type', 'company_main_office_address',
        'timezone_id', 'company_contact_name', 'company_contact_phone', 'company_email', 'company_usdot'
    ];
    const values = [ vars.company_name, vars.subscribe_type, vars.company_address, vars.company_timezone,
        vars.contact_name, vars.contact_phone, vars.email, vars.usdot
    ];
    const { params, update } = makeUpdateString(fields, values);
    params.push(company_id);

    try {
        db = await mQuery(`update company set ${update} where company_id = ?`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    try {
        db = await mQuery(`select * from company_address where company_id = ?`, [ company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }
    const existing_ids = db.map((item) => {
        return item.company_address_id;
    });
    db = null;

    let updated_addresses = [], added_addresses = [], deleted_addresses = [];
    let final_address_ids = [];
    for (let i = 0; i < vars.terminal_addresses.length; i++) {
        const company_address_item = vars.terminal_addresses[i];
        const company_address_id = company_address_item.company_address_id;
        const company_address_text = company_address_item.company_address_text;
        const is_address_found = existing_ids.find(value => {
            return value === company_address_id;
        });
        db = null;
        if (is_address_found) {     // need to update existing address
            try {
                const prs = [company_address_text, company_address_id];
                db = await mQuery(`update company_address
                                   set company_address_text = ?
                                   where company_address_id = ?`, prs);
                updated_addresses.push({
                    company_address_id: company_address_id,
                    company_address_text: company_address_text
                });
                final_address_ids.push(company_address_id);
            } catch (err) {
                return res.status(500).send(makeResponse(4, err));
            }
        } else {        // insert new address
            try {
                const prs = [company_id, company_address_text];
                db = await mQuery(`insert into company_address (company_id, company_address_text)
                                   values (?, ?)`, prs);
                added_addresses.push({company_address_id: db.insertId, company_address_text: company_address_text});
                final_address_ids.push(db.insertId);
            } catch (err) {
                return res.status(500).send(makeResponse(5, err));
            }
        }
    }
    // delete some addresses
    db = null;
    for (let i = 0; i < existing_ids.length; i++) {
        const to_delete_id = existing_ids[i];
        const is_found = final_address_ids.find((address_id) => { return address_id === to_delete_id; });
        if (!is_found) {        // delete "to_delete_id"
            try {
                db = await mQuery(`update company_address set company_address_status = 'DELETED' where company_address_id = ?`, [ to_delete_id ]);
                deleted_addresses.push({ company_address_id: to_delete_id });
            } catch (err) {
                return res.status(500).send(makeResponse(6, err));
            }
        }
    }

    return res.status(200).send(makeResponse(0, {
        added: added_addresses,
        updated: updated_addresses,
        deleted: deleted_addresses
    }));

});


module.exports = router;