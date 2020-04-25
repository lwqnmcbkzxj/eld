const express = require('express');
const router = express.Router();
const { makeResponse, mQuery, companyExists } = require('../../utils.js');

router.get('/', async function(req, res) { /* company_id */
    const company_id = req.auth_info.req_company_id;
    if (!company_id) return res.status(400).send(makeResponse(1, 'Empty company_id received'));

    const company_exists = companyExists(company_id);
    if (!company_exists) return res.status(404).send(makeResponse(2, 'Company was not found'));

    let db;
    try {
        db = await mQuery(`select v.vehicle_id, v.vehicle_sn, v.vehicle_issue_year, v.vehicle_status, 
                    vmake.vehicle_make_name, vmodel.vehicle_model_name, (acs.vehicle_id is not null) as is_reserved
                    from vehicle v left join vehicle_make vmake on v.vehicle_make_id = vmake.vehicle_make_id 
                    left join vehicle_model vmodel on v.vehicle_model_id = vmodel.vehicle_model_id 
                    left join active_session acs on v.vehicle_id = acs.vehicle_id 
                    where v.company_id = ? and v.vehicle_status = 'ACTIVE' order by v.vehicle_sort`, [company_id]);
        return res.status(200).send(makeResponse(0, db));
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }

    // makeQuery(`select company_id from company where company_id = ?`, [company_id], (db_result) => {
    //     if (db_result.result.length <= 0) return res.status(404).send(makeResponse(2, 'Wrong company ID. Company not found'));
    //     else {
    //         makeQuery(`select v.vehicle_id, v.vehicle_sn, v.vehicle_issue_year, v.vehicle_status,
    //                 vmake.vehicle_make_name, vmodel.vehicle_model_name, (acs.vehicle_id is not null) as is_reserved
    //                 from vehicle v left join vehicle_make vmake on v.vehicle_make_id = vmake.vehicle_make_id
    //                 left join vehicle_model vmodel on v.vehicle_model_id = vmodel.vehicle_model_id
    //                 left join active_session acs on v.vehicle_id = acs.vehicle_id
    //                 where v.company_id = ? order by v.vehicle_sort`, [company_id], (db_response) => {
    //
    //             return res.status(200).send(makeResponse(0, db_response.result));
    //
    //         }, (db_result) => {
    //             // return res.send(makeResponse(1, 'Unexpected error while getting data from database'));
    //             return res.status(500).send(makeResponse(1, db_result));
    //         });
    //     }
    // }, (db_result) => {
    //     return res.status(500).send(makeResponse(3, 'Unexpected error while selecting companies from database'));
    // });
});

module.exports = router;