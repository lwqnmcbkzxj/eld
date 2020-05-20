const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const infoRouter = require('./user/info');
const vehiclesRouter = require('./user/today-vehicles');
const uploadSignatureRouter = require('./user/upload-signature');
const getSignatureRouter = require('./user/get-signature');
const getLastSignaturesRouter = require('./user/get-last-signatures');
const editRouter = require('./user/edit');
const activateRouter = require('./user/activate');
const deActivateRouter = require('./user/deactivate');
const addRouter = require('./user/add');

const changePasswordRouter = require('./user/change-password');

router.use('/info', infoRouter);
router.use('/add', addRouter);
router.use('/activate', activateRouter);
router.use('/deactivate', deActivateRouter);
router.use('/today-vehicles', vehiclesRouter);
router.use('/upload-signature', uploadSignatureRouter);
router.use('/get-signature', getSignatureRouter);
router.use('/get-last-signatures', getLastSignaturesRouter);
router.use('/edit', editRouter);
router.use('/change-password', changePasswordRouter);

module.exports = router;