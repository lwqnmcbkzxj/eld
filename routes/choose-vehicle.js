const express = require('express');
const router = express.Router();
const { makeQuery, makeResponse, checkAuth } = require('../utils.js');
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', checkAuth, urlencodedParser);
router.post('/', function(req, res) { /* vehicle_id */
    // console.log(req.body);
    const vehicle_id = req.body.vehicle_id;
    const req_company_id = req.auth_info.req_company_id;
    const req_user_id = req.auth_info.req_user_id;
    // console.log(vehicle_id, req_company_id, req_user_id);
    if (!vehicle_id) return res.status(400).send(makeResponse(1, 'Empty vehicle_id received'));

    makeQuery(`select * from vehicle where vehicle_id = ? and company_id = ?`, [vehicle_id, req_company_id],
        (dsuc) => {
        if (dsuc.result.length <= 0) return res.status(404).send(makeResponse(2, 'Specified vehicle not found in company'));
        makeQuery(`update vehicle set driver_user_id = ? where vehicle_id = ? and company_id = ?`,
                [req_user_id, vehicle_id, req_company_id],(db_success) => {
                    const amount_of_changed_rows = db_success.result.changedRows;
                    if (amount_of_changed_rows >= 2) {
                        return res.status(200).send(makeResponse(3, 'Chosen more than one vehicles'));
                    } else {
                        return res.status(200).send(makeResponse(0, {company_id: req_company_id, vehicle_id: vehicle_id}));
                    }
                }, (db_fail) => {
                    return res.status(500).send(makeResponse(1, 'Unexpected error during database update'));
                    // return res.send(makeResponse(1, db_fail));
                }
            );
        }, (dfail) => {
            return res.status(500).send(makeResponse(4, 'Unexpected error during select to database'));
        }
    );
});

module.exports = router;