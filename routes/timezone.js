const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const getRouter = require('./timezone/get');

router.use('/get', getRouter);

module.exports = router;