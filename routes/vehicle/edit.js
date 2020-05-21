const router = require('express').Router();
const Joi = require('@hapi/joi');
const { mQuery, makeResponse, getVehicleMakeId, getVehicleModelId, makeUpdateString } = require('../../utils');

router.patch('/', async (req, res) => {
    let vars, db = null;
    try {
        const schema = Joi.object({
            vehicle_id: Joi.number().integer().min(1).required(),
            truck_number: Joi.string().required(),
            eld_id: Joi.number().integer().min(1),
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

    const model_obj = await getVehicleModelId(vars.model);
    const model_status = model_obj.status;
    const model_id = (model_status === 0) ? model_obj.result : null;

    const vehicle_serial_number = '';

    const fields = [ 'vehicle_make_id', 'vehicle_model_id', 'vehicle_sn', 'vehicle_issue_year', 'vehicle_vin',
        'vehicle_external_id', 'vehicle_fuel_type', 'vehicle_licence_plate', 'issuing_state_id', 'vehicle_notes',
        'vehicle_enter_vin_manually_flag', 'eld_id'
    ];
    const pars = [ make_id, model_id, vehicle_serial_number, vars.year, vars.vin, vars.truck_number, vars.fuel_type,
        vars.licence_plate, vars.state_id, vars.notes, vars.enter_vin_manually_flag, vars.eld_id
    ];
    const { params, update } = makeUpdateString(fields, pars);
    params.push(vars.vehicle_id);

    try {
        db = await mQuery(`update vehicle set ${update} where vehicle_id = ?`, params);
    } catch (err) {
        return res.status(500).send(makeResponse(4, err));
    }

    return res.status(201).send(makeResponse(0, { changedRows: db.changedRows }));
});

module.exports = router;