const express = require('express');
const router = express.Router();
const { checkAuth } = require('../utils.js');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

const getRouter = require('./vehicle/get');
const chooseVehicle = require('./vehicle/choose');
const getInfoVehicle = require('./vehicle/info');

router.use('/get', getRouter);
router.use('/choose', chooseVehicle);
router.use('/info', getInfoVehicle);


module.exports = router;