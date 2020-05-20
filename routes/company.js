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

router.use('/info', infoRouter);
router.use('/add', addRouter);
router.use('/edit', editRouter);
router.use('/drivers', driversRouter);
router.use('/terminals', terminalsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/activate', activateRouter);


module.exports = router;