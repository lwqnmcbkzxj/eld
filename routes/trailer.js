const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

router.use('/', sessionExtracter);

const getRouter = require('./trailer/get');
const addRouter = require('./trailer/add');

router.use('/get', getRouter);
router.use('/add', addRouter);

module.exports = router;