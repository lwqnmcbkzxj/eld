const express = require('express');
const router = express.Router();
const { makeResponse, mQuery } = require('../../utils.js');

router.post('/', async function(req, res) { /* vehicle_id */
    // console.log(req.body);
    const vehicle_id = req.body.vehicle_id;
    const req_company_id = req.auth_info.req_company_id;
    const req_user_id = req.auth_info.req_user_id;
    // console.log(vehicle_id, req_company_id, req_user_id);
    if (!vehicle_id) return res.status(400).send(makeResponse(1, 'Empty vehicle_id received'));
    let db;

    // check if vehicle_id is not reserved by another driver
    try {
        db = await mQuery(`select session_id, vehicle_id from session where session_status = 'ACTIVE' 
                                and vehicle_id = ?`, [vehicle_id]);
        if (db.length >= 1) {
            return res.status(403).send(makeResponse(5, 'Vehicle is already reserved by another driver'));
        }
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    // check if vehicle_id exists
    try {
        db = await mQuery(`select vehicle_id from vehicle where vehicle_id = ? and vehicle_status = 'ACTIVE'`, [vehicle_id]);
        if (db.length <= 0) return res.status(500).send(makeResponse(9, 'Cannot find ACTIVE vehicle with such vehicle_id'));
    } catch (err) {
        return res.status(500).send(makeResponse(8, err));
    }

    try {   // try to find active session
        db = await mQuery(`select session_id from session where session_status = 'ACTIVE' and driver_user_id = ? 
            order by session_start_dt desc`, [req_user_id]);
    } catch (err) {
        return res.status(500).send(makeResponse(3, err));
    }
    const n = db.length;
    let session_id = null;
    if (n <= 0) {   // create new session for user req_user_id
        try {
            db = await mQuery(`insert into session(driver_user_id, vehicle_id) VALUES(?, ?)`, [req_user_id, vehicle_id]);
        } catch (err) {
            return res.status(500).send(makeResponse(2, err));
        }
        session_id = db.insertId;
    } else {    // found not finished active session
        session_id = db[0].session_id;

        // update vehicle_id in found record of session_id
        try {
            db = await mQuery(`update session set vehicle_id = ? where session_id = ?`, [vehicle_id, session_id]);
        } catch (err) {
            return res.status(500).send(makeResponse(6, err))
        }
        const changedRows = db.changedRows;
        if (changedRows <= 0) {
            return res.status(200).send(makeResponse(7, `Unexpected backend behaviour. No rows updated`));
        }
    }
    return res.status(200).send(makeResponse(0, {session_id: session_id, vehicle_id: vehicle_id}));

    // makeQuery(`select * from vehicle where vehicle_id = ? and company_id = ?`, [vehicle_id, req_company_id],
    //     (dsuc) => {
    //     if (dsuc.result.length <= 0) return res.status(404).send(makeResponse(2, 'Specified vehicle not found in company'));
    //     makeQuery(`insert into session(driver_user_id, vehicle_id) VALUES(?, ?)`,[req_user_id, vehicle_id],(db_success) => {
    //         const session_id = db_success.result.insertId;
    //         return res.status(201).send(makeResponse(0, {session_id: session_id, vehicle_id: vehicle_id}));
    //             }, (db_fail) => {
    //                 return res.status(500).send(makeResponse(1, 'Unexpected error during database update'));
    //                 // return res.send(makeResponse(1, db_fail));
    //             }
    //         );
    //     }, (dfail) => {
    //         return res.status(500).send(makeResponse(4, 'Unexpected error during select to database'));
    //     }
    // );
});

module.exports = router;