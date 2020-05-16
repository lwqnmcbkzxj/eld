const router = require('express').Router();
const { checkAuth } = require('../utils');

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);
router.use('/', checkAuth);


const infoRouter = require('./company/info');
const editRouter = require('./company/edit');
const addRouter = require('./company/add');

router.use('/info', infoRouter);
router.use('/add', addRouter);
router.use('/edit', editRouter);


module.exports = router;