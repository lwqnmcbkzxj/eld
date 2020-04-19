const express = require('express');
const router = express.Router();
const { checkAuth } = require('../utils.js');

router.use('/', checkAuth);

const addRouter = require('./dvir/add');
const deleteRouter = require('./dvir/delete')
const getRouter = require('./dvir/get')

router.use('/add', addRouter);
router.use('/delete', deleteRouter);
router.use('/get', getRouter);

module.exports = router;