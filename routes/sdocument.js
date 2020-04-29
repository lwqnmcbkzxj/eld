const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

router.use('/', sessionExtracter);

const getRouter = require('./sdocument/get');
const addRouter = require('./sdocument/add');
const deleteRouter = require('./sdocument/delete');
const editRouter = require('./sdocument/edit');

router.use('/get', getRouter);
router.use('/add', addRouter);
router.use('/delete', deleteRouter);
router.use('/edit', editRouter);

module.exports = router;