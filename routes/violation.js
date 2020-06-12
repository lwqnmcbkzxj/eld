const router = require('express').Router();
const { checkAuth, sessionExtracter } = require('../utils.js');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);
router.use('/', sessionExtracter);

const addRouter = require('./violation/add');

router.use('/add', addRouter);


module.exports = router;