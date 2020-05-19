const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

router.use('/', sessionExtracter);

const getRouter = require('./shipping_document/get');
const addRouter = require('./shipping_document/add');
const deleteRouter = require('./shipping_document/delete');
const editRouter = require('./shipping_document/edit');

router.use('/get', getRouter);
router.use('/add', addRouter);
router.use('/delete', deleteRouter);
router.use('/edit', editRouter);

module.exports = router;