const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('../utils.js');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);
router.use('/', sessionExtracter);

const addRouter = require('./record/add');
const editRouter = require('./record/edit');
const getRouter = require('./record/get');


router.use('/add', addRouter);
router.use('/edit', editRouter);
router.use('/get', getRouter);


module.exports = router;