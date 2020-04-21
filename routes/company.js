const router = require('express').Router();
const { checkAuth } = require('../utils');

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });

router.use('/', urlencodedParser);
router.use('/', checkAuth);


const infoRouter = require('./company/info');

router.use('/info', infoRouter);


module.exports = router;