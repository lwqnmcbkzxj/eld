const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.delete('/', async (req, res) => {  /* signature_id */
    const req_user_id = req.auth_info.req_user_id;
    const signature_id = req.body.signature_id;
    if (!signature_id) return res.status(400).send(makeResponse(2, 'Received empty signature_id'));

    let db;
    try {
        const params = [ req_user_id, signature_id ];
        db = await mQuery(`update signature set signature_status = 'DELETED' 
            where signature_user_id = ? and signature_id = ?`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

    return res.status(200).send(makeResponse(0, { deletedRows: db.changedRows }));
});

module.exports = router;