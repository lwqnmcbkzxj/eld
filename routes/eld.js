const router = require('express').Router();
const { checkAuth } = require('./../utils');
const body_parser = require('body-parser').urlencoded({ extended: false });

router.use('/', checkAuth);
router.use('/', body_parser);

// const getRouter = require('./eld/get');
const addRouter = require('./eld/add');
// const editRouter = require('./eld/edit');

// router.use('/get', getRouter);
router.use('/add', addRouter);
// router.use('/edit', editRouter);

module.exports = router;