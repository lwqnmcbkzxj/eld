const router = require('express').Router();
const { checkAuth } = require('./../utils');
const body_parser = require('body-parser').urlencoded({ extended: false });

router.use('/', checkAuth);
router.use('/', body_parser);

const getRouter = require('./eld/get');
const addRouter = require('./eld/add');
const editRouter = require('./eld/edit');
const deleteRouter = require('./eld/delete');
const activateRouter = require('./eld/activate');

router.use('/get', getRouter);
router.use('/add', addRouter);
router.use('/edit', editRouter);
router.use('/delete', deleteRouter);
router.use('/activate', activateRouter);

module.exports = router;