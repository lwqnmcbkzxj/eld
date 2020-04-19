const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../utils.js');

router.use('/', checkAuth);

const addRouter = require('./add');
const deleteRouter = require('./delete')
const getRouter = require('./get')

router.use('/add', addRouter);
router.use('/delete', deleteRouter);
router.use('/get', getRouter);

module.exports = router;