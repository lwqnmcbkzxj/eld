const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../utils.js');

router.use('/', checkAuth);

const getRouter = require('./get');
const chooseVehicle = require('./choose');

router.use('/get', getRouter);
router.use('/choose', chooseVehicle);


module.exports = router;