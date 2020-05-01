const router = require('express').Router();
const { mQuery, makeResponse } = require('./../../utils');

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    // const session_id = req.auth_info.session_id;

    try {
        const db = await mQuery(`select st.session_shipping_document_id, st.session_id, t.shipping_document_id, t.shipping_document_external_id, st.session_shipping_document_status
                                 from session_shipping_document st left join shipping_document t on st.shipping_document_id = t.shipping_document_id left join session s on st.session_id = s.session_id
                                 where s.driver_user_id = ? and st.session_shipping_document_status <> 'DELETED'`, [req_user_id]);
        return res.status(200).send(makeResponse(0, db));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

});

router.get('/:date', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const date = req.params.date;
    // const session_id = req.auth_info.session_id;

    try {
        const db = await mQuery(`select st.session_shipping_document_id, st.session_id, t.shipping_document_id, t.shipping_document_external_id, st.session_shipping_document_status
                from session_shipping_document st left join shipping_document t on st.shipping_document_id = t.shipping_document_id left join session s on st.session_id = s.session_id
                where s.driver_user_id = ? and 
                (date_format(st.session_shipping_document_dt, '%Y-%m-%d') = ?)`, [ req_user_id, date ]);
        return res.status(200).send(makeResponse(0, db));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

});


module.exports = router;