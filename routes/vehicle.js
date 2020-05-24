const express = require('express');
const router = express.Router();
const { checkAuth } = require('../utils.js');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

const getRouter = require('./vehicle/get');
const chooseVehicle = require('./vehicle/choose');
const getInfoVehicle = require('./vehicle/info');
const addVehicle = require('./vehicle/add');
const listVehicle = require('./vehicle/list');
const editVehicle = require('./vehicle/edit');
const deleteVehicle = require('./vehicle/delete');
const fuelTypesVehicle = require('./vehicle/fuel-types');

router.use('/get', getRouter);
router.use('/choose', chooseVehicle);
router.use('/info', getInfoVehicle);
router.use('/add', addVehicle);
router.use('/list', listVehicle);
router.use('/edit', editVehicle);
router.use('/delete', deleteVehicle);
router.use('/fuel-types', fuelTypesVehicle);


module.exports = router;