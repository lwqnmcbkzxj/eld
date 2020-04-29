const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.patch('/', async (req, res) => {     /* session_shipping_document_id, new_external_shipping_document_id */
    const session_shipping_document_id = req.body.session_shipping_document_id;
    const new_external_shipping_document_id = req.body.new_name;
    if (!session_shipping_document_id) return res.status(400).send(makeResponse(1, 'Empty session_shipping_document_id'));
    if (!new_external_shipping_document_id) return res.status(400).send(makeResponse(2, 'Empty new_external_shipping_document_id'));

    // determine shipping_document_id
    let shipping_document_id = null;
    try {
        const db = await mQuery(`select shipping_document_id from session_shipping_document where session_shipping_document_id = ?`, [session_shipping_document_id]);
        const n = db.length;
        if (n <= 0) return res.status(404).send(makeResponse(4, 'Object to edit was not found'));
        shipping_document_id = db[0].shipping_document_id;
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    try {
        const db = await mQuery(`update shipping_document set shipping_document_external_id = ? where shipping_document_id = ?`, [new_external_shipping_document_id, shipping_document_id]);
        const n = db.changedRows;
        if (n <= 0) return res.status(200).send(makeResponse(5, 'Warning while updating shipping_document_id = ' + shipping_document_id + '. Nothing updated'));
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    return res.status(200).send(makeResponse(0, {
        session_shipping_document_id: session_shipping_document_id,
        shipping_document_id: shipping_document_id,
        new_external_shipping_document_id: new_external_shipping_document_id
    }));
});

module.exports = router;