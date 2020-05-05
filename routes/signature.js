const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

const getRouter = require('./signature/get');


router.use('/get', getRouter);


module.exports = router;