const express = require('express');
const router = express.Router();
const { checkAuth, sessionExtracter } = require('../utils.js');

router.use('/', checkAuth);
router.use('/', sessionExtracter);

// const vehiclesRouter = require('./session/vehicles');


// router.use('/vehicles', vehiclesRouter);


module.exports = router;