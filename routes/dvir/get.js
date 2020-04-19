const router = require('express').Router();
const { makeQuery, makeResponse } = require('../../utils.js');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);

router.get('/', (req, res) => {  /* no parameters */
    const req_user_id = req.auth_info.req_user_id;
    makeQuery(`select dvir_id, (driver_signature_id is not null) as has_driver_signature,
       (mechanic_signature_id is not null) as has_mechanics_signature, dvir_deffects_status,
       dvir_dt, dvir_location, dvir_description from dvir where user_id = ? and dvir_status = 'ACTIVE'`, [req_user_id], (suc) => {
        return res.status(200).send(makeResponse(0, suc.result));
    }, (fail) => {
        return res.status(500).send(makeResponse(1, 'Unexpected error while fetching data about DVIRs'));
    });
});

module.exports = router;