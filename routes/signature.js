const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', require('body-parser').urlencoded({ extended: true }));
router.use('/', checkAuth);

const getRouter = require('./signature/get');
const deleteRouter = require('./signature/delete');


router.use('/get', getRouter);
router.use('/delete', deleteRouter);


module.exports = router;