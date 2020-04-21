const router = require('express').Router();

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use('/', urlencodedParser);


const infoRouter = require('./company/info');

router.use('/info', infoRouter);


module.exports = router;