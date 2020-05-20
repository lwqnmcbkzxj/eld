const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const getRouter = require('./state/get');

router.use('/get', getRouter);

module.exports = router;