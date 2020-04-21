const express = require('express');
const router = express.Router();
const { checkAuth } = require('../utils.js');

router.use('/', checkAuth);

const getRouter = require('./vehicles/get');
const chooseVehicle = require('./vehicles/choose');
const getInfoVehicle = require('./vehicles/get-info');

router.use('/get', getRouter);
router.use('/choose', chooseVehicle);
router.use('/get-info', getInfoVehicle);


module.exports = router;