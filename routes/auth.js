const express = require('express');
const router = express.Router();

const addRouter = require('./auth/login');

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use('/', urlencodedParser);

router.use('/login', addRouter);

module.exports = router;