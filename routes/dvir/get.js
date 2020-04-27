const router = require('express').Router();
const { makeQuery, makeResponse } = require('../../utils.js');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);

router.get('/', (req, res) => {  /* no parameters */
    const req_user_id = req.auth_info.req_user_id;
    makeQuery(`select dvir_id, (driver_signature_id is not null) as has_driver_signature, session_id, 
       (mechanic_signature_id is not null) as has_mechanics_signature, dvir_deffects_status, vehicle_id,
       dvir_created_dt, dvir_location, dvir_description from dvir 
        where creator_user_id = ? and dvir_status = 'ACTIVE' and dvir_created_dt >= date_sub(current_timestamp, interval 14 day)`,
            [req_user_id], (suc) => {
        return res.status(200).send(makeResponse(0, suc.result));
    }, (fail) => {
        return res.status(500).send(makeResponse(1, fail));
    });
});

module.exports = router;