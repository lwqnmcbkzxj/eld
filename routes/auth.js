const express = require('express');
const router = express.Router();

const loginRouter = require('./auth/login');
const logoutRouter = require('./auth/logout');

var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
router.use('/', urlencodedParser);

router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

module.exports = router;