const router = require('express').Router();
const { checkAuth } = require('../utils');

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);
router.use('/', checkAuth);


const infoRouter = require('./company/info');
const editRouter = require('./company/edit');
const addRouter = require('./company/add');
const driversRouter = require('./company/drivers');
const terminalsRouter = require('./company/terminals');
const vehiclesRouter = require('./company/vehicles');
const activateRouter = require('./company/activate');
const deactivateRouter = require('./company/deactivate');

router.use('/info', infoRouter);
router.use('/add', addRouter);
router.use('/edit', editRouter);
router.use('/drivers', driversRouter);
router.use('/terminals', terminalsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/activate', activateRouter);
router.use('/deactivate', deactivateRouter);


module.exports = router;