const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const infoRouter = require('./user/info');
const vehiclesRouter = require('./user/today-vehicles');
const uploadSignatureRouter = require('./user/upload-signature');
const getSignatureRouter = require('./user/get-signature');

router.use('/info', infoRouter);
router.use('/today-vehicles', vehiclesRouter);
router.use('/upload-signature', uploadSignatureRouter);
router.use('/get-signature', getSignatureRouter);

module.exports = router;