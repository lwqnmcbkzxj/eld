const path = require('path');
const setTZ = require('set-tz');
const cors = require('cors');
setTZ('UTC');
global.app_root = path.resolve(__dirname);

const { initMysqlConnection } = require('./utils');

let express = require('express');
let eldApp = express();

initMysqlConnection(function() {}, function() {});

//import routes
const vehiclesRoute = require('./routes/vehicle');
const dvirRouter = require('./routes/dvir');
const authRouter = require('./routes/auth');
const trailerRouter = require('./routes/trailer');
const sdocumentRouter = require('./routes/sdocument');
const companyRouter = require('./routes/company');
const userRouter = require('./routes/user');
const recordRouter = require('./routes/record');
const logsRouter = require('./routes/logs');
const signatureRouter = require('./routes/signature');
const timezoneRouter = require('./routes/timezone');
const stateRouter = require('./routes/state');
const eldRouter = require('./routes/eld');
const violationRouter = require('./routes/violation');
// const sessionRouter = require('./routes/session');

eldApp.use(cors());
eldApp.use('/vehicle', vehiclesRoute);
eldApp.use('/dvir', dvirRouter);
eldApp.use('/auth', authRouter);
eldApp.use('/trailer', trailerRouter);
eldApp.use('/company', companyRouter);
eldApp.use('/user', userRouter);
eldApp.use('/record', recordRouter);
eldApp.use('/sdocument', sdocumentRouter);
eldApp.use('/logs', logsRouter);
eldApp.use('/signature', signatureRouter);
eldApp.use('/timezone', timezoneRouter);
eldApp.use('/state', stateRouter);
eldApp.use('/eld', eldRouter);
eldApp.use('/violation', violationRouter);
// app.use('/session', sessionRouter);

const port = 3021;
eldApp.listen(port, function() {
  console.log('Listening to port ' + port + ' ....');
  // console.log(getCurDt());
});