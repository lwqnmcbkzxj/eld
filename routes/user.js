const router = require('express').Router();
const { checkAuth } = require('./../utils');

router.use('/', checkAuth);

const infoRouter = require('./user/info');

router.use('/info', infoRouter);

module.exports = router;