const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const infoRouter = require('./user/info');
const vehiclesRouter = require('./user/today-vehicles');

router.use('/info', infoRouter);
router.use('/today-vehicles', vehiclesRouter);

module.exports = router;