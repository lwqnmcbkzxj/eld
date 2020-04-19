const express = require('express');
const router = express.Router();
const { checkAuth } = require('../utils.js');

router.use('/', checkAuth);

const getRouter = require('./vehicles/get');
const chooseVehicle = require('./vehicles/choose');

router.use('/get', getRouter);
router.use('/choose', chooseVehicle);


module.exports = router;