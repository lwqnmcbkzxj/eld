const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.delete('/', async (req, res) => {    /* session_shipping_document_id */
    // const req_user_id = req.auth_info.req_user_id;
    // const session_id = req.auth_info.session_id;
    const session_shipping_document_id = req.body.session_shipping_document_id;

    if (!session_shipping_document_id) return res.status(400).send(makeResponse(1, 'Empty session_shipping_document_id'));

    let db;
    try{
        db = await mQuery(`update session_shipping_document set session_shipping_document_status = 'DELETED' where session_shipping_document_id = ?`, [session_shipping_document_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    return res.status(200).send(makeResponse(0, {amount_of_deleted_records: db.changedRows}));
});

module.exports = router;