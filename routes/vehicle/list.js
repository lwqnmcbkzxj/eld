const express = require('express');
const router = express.Router();
const { makeResponse, mQuery } = require('../../utils.js');
const Joi = require('@hapi/joi');

router.get('/:company_id', async function(req, res) {
    let vars, db = null;
    try {
        const schema = Joi.object({
            company_id: Joi.number().integer().min(1).required()
        });
        vars = await schema.validateAsync(req.params);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    try {
        db = await mQuery(`select v.vehicle_id, v.vehicle_external_id as vehicle_truck_number, vmake.vehicle_make_name,
        vmodel.vehicle_model_name, v.vehicle_licence_plate, e.eld_serial_number, v.vehicle_notes, v.vehicle_status, 
        e.eld_id, e.eld_status
        from vehicle v left join vehicle_make vmake on v.vehicle_make_id = vmake.vehicle_make_id 
        left join vehicle_model vmodel on v.vehicle_model_id = vmodel.vehicle_model_id
        left join eld e on v.eld_id = e.eld_id where v.company_id = ?`,
            [ vars.company_id ]);
    } catch (err) {
        return res.status(500).send(makeResponse(2, err));
    }

    db.forEach((item) => {
        if (item.eld_status) {
            if (item.eld_status.localeCompare("ACTIVE")) {
                item.eld_id = null;
                item.eld_serial_number = null;
            }
        }
    });
    return res.status(200).send(makeResponse(0, db));
});

module.exports = router;