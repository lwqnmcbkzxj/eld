const path = require('path');
global.app_root = path.resolve(__dirname);

const { initMysqlConnection } = require('./utils');

let express = require('express');
let app = express();

initMysqlConnection(function() {}, function() {});

//import routes
const vehiclesRoute = require('./routes/vehicle');
const dvirRouter = require('./routes/dvir');
const authRouter = require('./routes/auth');
const trailerRouter = require('./routes/trailer');
const companyRouter = require('./routes/company');
const userRouter = require('./routes/user');
const recordRouter = require('./routes/record');
// const sessionRouter = require('./routes/session');

app.use('/vehicle', vehiclesRoute);
app.use('/dvir', dvirRouter);
app.use('/auth', authRouter);
app.use('/trailer', trailerRouter);
app.use('/company', companyRouter);
app.use('/user', userRouter);
app.use('/record', recordRouter);
// app.use('/session', sessionRouter);

const port = 3000;
app.listen(port, function() {
  console.log('Listening to port ' + port + ' ....');
});