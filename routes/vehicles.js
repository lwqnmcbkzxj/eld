const express = require('express');
const router = express.Router();
const { makeQuery, makeResponse, checkAuth } = require('../utils.js');

router.use('/', checkAuth);

router.get('/:company_id', function(req, res) { /* company_id */
    const company_id = req.params.company_id;
    if (!company_id) return res.send(makeResponse(1, 'Empty company_id received'));

    makeQuery(`select company_id from company where company_id = ?`, [company_id], (db_result) => {
        if (db_result.result.length <= 0) return res.send(makeResponse(2, 'Wrong company ID'));
        else {
            makeQuery(`select v.vehicle_id, v.vehicle_sn, v.vehicle_issue_year, v.vehicle_status, 
                    vmake.vehicle_make_name, vmodel.vehicle_model_name, (v.driver_user_id is not null) as is_reserved
                    from vehicle v left join vehicle_make vmake on v.vehicle_make_id = vmake.vehicle_make_id 
                    left join vehicle_model vmodel on v.vehicle_model_id = vmodel.vehicle_model_id 
                    where v.company_id = ? order by v.vehicle_sort`, [company_id], (db_response) => {

                return res.send(makeResponse(0, db_response.result));

            }, (db_result) => {
                // return res.send(makeResponse(1, 'Unexpected error while getting data from database'));
                return res.send(makeResponse(1, db_result));
            });
        }
    }, (db_result) => {
        return res.send(makeResponse(3, 'Unexpected error while selecting companies from database'));
    });
});

module.exports = router;