const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../utils.js');

router.use('/', checkAuth);

const addRouter = require('./add');

router.use('/add', addRouter);

module.exports = router;