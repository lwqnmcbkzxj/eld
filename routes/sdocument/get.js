const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.get('/', async (req, res) => {
    // const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;

    try {
        const db = await mQuery(`select st.session_shipping_document_id, st.session_id, t.shipping_document_id, t.shipping_document_external_id, st.session_shipping_document_status
            from session_shipping_document st left join shipping_document t on st.shipping_document_id = t.shipping_document_id where st.session_id = ?`, [session_id]);
        return res.status(200).send(makeResponse(0, db));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

});


module.exports = router;