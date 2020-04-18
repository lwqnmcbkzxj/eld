const { makeQuery, makeResponse } = require('../utils.js');
let fs = require('fs');

module.exports = function(req, res) { /* vehicle_id, location, has_defects, description, signature */
    const vehicle_id = req.body.vehicle_id;
    // const dt = req.body.dt;
    const location = req.body.location;
    const defects_status = (parseInt(req.body.has_defects) === 0) ? 'NO_DEFECTS' : 'HAS_DEFECTS';
    const description = req.body.description;
    const signature = req.file;
    if (!signature) return res.send(makeResponse(4, 'File with signature was not uploaded. DVIR not created'));
    const file_path = signature.path;

    const req_company_id = req.auth_info.req_company_id;
    const req_user_id = req.auth_info.req_user_id;

    console.log(vehicle_id, req_company_id, req_user_id);
    if (!vehicle_id) return res.send(makeResponse(1, 'Empty vehicle_id received'));

    makeQuery(`insert into signature(signature_user_id, signature_src, signature_status) values 
    (?, ?, ?)`, [req_user_id, signature.path, 'ACTIVE'], (sig_suc) => {
        const signature_id = sig_suc.result.insertId;
        makeQuery(`insert into dvir(vehicle_id, driver_signature_id, mechanic_signature_id, dvir_location, dvir_deffects_status, dvir_description, user_id, dvir_status) 
        values (?, ?, ?, ?, ?, ?, ?, ?)`, [vehicle_id, signature_id, null, location, defects_status, description, req_user_id, 'ACTIVE'], (dvir_suc) => {
            const dvir_id = dvir_suc.result.insertId;
            return res.send(makeResponse(0, {dvir_id: dvir_id, signature_id: signature_id}));
            }, (dvir_fail) => {
                makeQuery(`delete from signature where signature_id = ? limit 1`, [signature_id], (del_suc) => {
                    fs.unlinkSync(file_path);
                    return res.send(makeResponse(1, 'Could not insert new DVIR. Uploaded signature cleared successfully'));
                }, (del_fail) => {
                    fs.unlinkSync(file_path);
                    return res.send(makeResponse(2, 'Could not insert new DVIR. Failed to clear signature!'));
                });
            }
        );
    }, (sig_fail) => {
        fs.unlinkSync(file_path);
        return res.send(makeResponse(3, 'Could not insert new signature. New DVIR not created'));
    });
};