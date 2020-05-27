const router = require('express').Router();
const { mQuery, makeResponse } = require('../../utils.js');

router.get('/:vehicle_id', async function(req, res) { /* vehicle_id */
    const vehicle_id = req.params.vehicle_id;
    if (!vehicle_id) return res.status(400).send(makeResponse(1, 'Empty vehicle_id received'));

    let db = null;
    try {
        db = await mQuery(`select v.vehicle_id, v.vehicle_vin, vm.vehicle_make_name, m.vehicle_model_name, c.company_short_name,
            v.vehicle_external_id as vehicle_truck_number, v.vehicle_issue_year, v.vehicle_fuel_type, 
            v.vehicle_licence_plate, v.issuing_state_id, CAST(v.vehicle_enter_vin_manually_flag as UNSIGNED) as vehicle_enter_vin_manually_flag, 
            v.vehicle_notes, v.vehicle_status, v.eld_id 
            from vehicle v left join company c on v.company_id = c.company_id 
            left join vehicle_make vm on v.vehicle_make_id = vm.vehicle_make_id 
            left join vehicle_model m on v.vehicle_model_id = m.vehicle_model_id 
            where vehicle_id = ?
        `, [ vehicle_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    const n = db.length;
    if (n >= 2) return res.status(500).send(makeResponse(3, db));
    if (n === 0) return res.status(200).send(makeResponse(0, {}));

    return res.status(200).send(makeResponse(0, db[0]));
});

module.exports = router;