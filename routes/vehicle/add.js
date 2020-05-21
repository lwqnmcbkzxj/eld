const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse, getVehicleMakeId, getVehicleModelId } = require('../../utils');

router.post('/', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            truck_number: Joi.string().required(),
            company_id: Joi.number().integer().min(1).required(),
            eld_id: Joi.string(),
            make: Joi.string(),
            model: Joi.string(),
            year: Joi.number().integer().min(1900).max(3000),
            fuel_type: Joi.string().valid('DIESEL', 'GASOLINE', 'PROPANE', 'LIQUID NATURAL GAS', 'COMPRESSED NATURAL GAS', 'ETHANOL'),
            licence_plate: Joi.string(),
            state_id: Joi.number().integer().min(1),
            enter_vin_manually_flag: Joi.number().integer().min(0).max(1).required(),
            vin: Joi.string(),
            notes: Joi.string()
        });
        vars = await schema.validateAsync(req.body);
    } catch (err) {
        return res.status(400).send(makeResponse(1, err));
    }

    const make_obj = await getVehicleMakeId(vars.make);
    const make_status = make_obj.status;
    const make_id = (make_status === 0) ? make_obj.result : null;
    // if (make_status !== 0) return res.status(500).send(makeResponse(2, make_id));

    const model_obj = await getVehicleModelId(vars.model);
    const model_status = model_obj.status;
    const model_id = (model_status === 0) ? model_obj.result : null;
    // if (model_status !== 0) return res.status(500).send(makeResponse(3, model_id));

    const vehicle_serial_number = '';
    try {
        const params = [ vars.company_id, make_id, model_id, vehicle_serial_number, vars.year, vars.vin, vars.truck_number,
            vars.fuel_type, vars.licence_plate, vars.state_id, vars.notes, vars.enter_vin_manually_flag, vars.eld_id
        ];
        const question_marks = params.map(() => { return '?'; }).join(", ");
        db = await mQuery(`insert into vehicle (company_id, vehicle_make_id, vehicle_model_id, vehicle_sn, 
             vehicle_issue_year, vehicle_vin, vehicle_external_id, vehicle_fuel_type, vehicle_licence_plate, 
             issuing_state_id, vehicle_notes, vehicle_enter_vin_manually_flag, eld_id) 
             values (${question_marks})`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    return res.status(201).send(makeResponse(0, { vehicle_id: db.insertId }));
});

module.exports = router;