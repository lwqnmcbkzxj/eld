const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const infoRouter = require('./user/info');
const vehiclesRouter = require('./user/today-vehicles');
const uploadSignatureRouter = require('./user/upload-signature');

router.use('/info', infoRouter);
router.use('/today-vehicles', vehiclesRouter);
router.use('/upload-signature', uploadSignatureRouter);

module.exports = router;