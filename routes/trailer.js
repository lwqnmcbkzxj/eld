const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', require('body-parser').json());
router.use('/', checkAuth);

const getRouter = require('./trailer/get');

router.use('/get', getRouter);

module.exports = router;