const router = require('express').Router();
const { mQuery, makeResponse, getActiveSessionID } = require('./../../utils');

router.get('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;

    try {
        const db = await mQuery(`select st.session_trailer_id, st.session_id, t.trailer_id, t.trailer_external_id, st.session_trailer_status
            from session_trailer st left join trailer t on st.trailer_id = t.trailer_id where st.session_id = ?`, [session_id]);
        return res.status(200).send(makeResponse(0, db));
    } catch (err) {
        return res.status(500).send(makeResponse(1, err));
    }

});


module.exports = router;