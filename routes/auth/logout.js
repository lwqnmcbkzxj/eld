const router = require('express').Router();
const { mQuery, makeResponse, checkAuth, sessionExtracter } = require('../../utils');

router.use('/', checkAuth);
router.use('/', sessionExtracter);

router.post('/', async (req, res) => {
    const req_user_id = req.auth_info.req_user_id;
    const session_id = req.auth_info.session_id;
    // if (!session_id) return res.status(500).send(makeResponse(1, 'Could not identify session_id'));

    // close current session
    if (session_id) {
        try {
            const db = await mQuery(`update session set session_status = 'FINISHED', session_end_dt = current_timestamp 
                                    where session_id = ?`, [session_id]);
        } catch (err) {
            // return res.status(500).send(makeResponse(2, err));
        }
    }

    // logout user
    try {
        const db = await mQuery(`update user set user_token = '' where user_id = ?`, [ req_user_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    return res.status(200).send(makeResponse(0, 'User Logged Out'));
});


module.exports = router;