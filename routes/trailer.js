const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

router.use('/', sessionExtracter);

const getRouter = require('./trailer/get');
const addRouter = require('./trailer/add');
const deleteRouter = require('./trailer/delete');

router.use('/get', getRouter);
router.use('/add', addRouter);
router.use('/delete', deleteRouter);

module.exports = router;