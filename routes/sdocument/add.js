const router = require('express').Router();
const { mQuery, makeResponse, getCurDt } = require('./../../utils');

router.post('/', async (req, res) => {  /* shipping_document_name, date */
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    const shipping_document_external_id = req.body.shipping_document_name;
    const dt = (!req.body.date) ? getCurDt() : req.body.date;

    if (!shipping_document_external_id) return res.status(400).send(makeResponse(5, 'Empty shipping_document_name received'));

    // check if 'shipping_document_external_id' already exists
    try {
        const db_sdoc = await mQuery(`select * from shipping_document where shipping_document_external_id = ?`, [shipping_document_external_id]);
        const n = db_sdoc.lenght;
        if (n > 0) return res.status(409).send(makeResponse(2, 'Shipping document with name ' + shipping_document_external_id + ' already exists'));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    // add new shipping_document
    let shipping_document_id = null;
    try {
        const db = await mQuery(`insert into shipping_document(shipping_document_external_id, creator_user_id) values (?, ?)`,
            [shipping_document_external_id, req_user_id]);
        shipping_document_id = db.insertId;
    } catch (err2) {
        const db = await mQuery(`select shipping_document_id from shipping_document where shipping_document_external_id = ?`, [shipping_document_external_id]);
        // console.log(db);
        shipping_document_id = db[0].shipping_document_id;
    }

    // add new (session_id, shipping_document_id)
    try {
        const db = await mQuery(`insert into session_shipping_document(session_id, shipping_document_id, session_shipping_document_dt) VALUES (?, ?, ?)`,
            [ session_id, shipping_document_id, dt ]);
        const session_shipping_document_id = db.insertId;
        return res.status(201).send(makeResponse(0, {
            session_id: session_id,
            shipping_document_id: shipping_document_id,
            shipping_document_external_id: shipping_document_external_id,
            session_shipping_document_id: session_shipping_document_id
        }));
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }
});


module.exports = router;