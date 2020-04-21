const { initMysqlConnection } = require('./utils');
const { BASE_DIR } = require('./const');

let express = require('express');
let app = express();

initMysqlConnection(function() {}, function() {});

//import routes
const vehiclesRoute = require('./routes/vehicles');
const dvirRouter = require('./routes/dvir');
const authRouter = require('./routes/auth');

app.use('/vehicles', vehiclesRoute);
app.use('/dvir', dvirRouter);
app.use('/auth', authRouter);

const port = 3000;
app.listen(port, function() {
  console.log('Listening to port ' + port + ' ....');
});