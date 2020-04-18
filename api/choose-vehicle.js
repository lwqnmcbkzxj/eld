const { makeQuery, makeResponse } = require('../utils.js');

module.exports = function(req, res) { /* vehicle_id */
    const vehicle_id = req.body.vehicle_id;
    const req_company_id = req.auth_info.req_company_id;
    const req_user_id = req.auth_info.req_user_id;
    // console.log(vehicle_id, req_company_id, req_user_id);
    if (!vehicle_id) return res.send(makeResponse(1, 'Empty vehicle_id received'));

    makeQuery(`select * from vehicle where vehicle_id = ? and company_id = ?`, [vehicle_id, req_company_id],
        (dsuc) => {
            makeQuery(`update vehicle set driver_user_id = ? where vehicle_id = ? and company_id = ?`,
                [req_user_id, vehicle_id, req_company_id],(db_success) => {
                    const amount_of_changed_rows = db_success.result.changedRows;
                    if (amount_of_changed_rows >= 2) {
                        return res.send(makeResponse(3, 'Updated more than two vehicles'));
                    } else {
                        return res.send(makeResponse(0, {company_id: req_company_id, vehicle_id: vehicle_id}));
                    }
                }, (db_fail) => {
                    return res.send(makeResponse(1, 'Unexpected error during database update'));
                    // return res.send(makeResponse(1, db_fail));
                }
            );
        }, (dfail) => {
            return res.send(makeResponse(2, 'Specified vehicle in company not found'));
        }
    );



};