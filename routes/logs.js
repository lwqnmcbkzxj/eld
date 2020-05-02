const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('../utils.js');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);
// router.use('/', sessionExtracter);

// const addRouter = require('./logs/add');
// const editRouter = require('./logs/edit');
const getRouter = require('./logs/get');

router.use('/get', getRouter);


module.exports = router;