const { initMysqlConnection } = require('./utils');
const { BASE_DIR } = require('./const');

let express = require('express');
let app = express();

initMysqlConnection(function() {}, function() {});

//import routes
const loginRoute = require('./routes/login');
const vehiclesRoute = require('./routes/vehicles/vehicles');
const dvirRouter = require('./routes/dvir/dvir');

app.use('/login', loginRoute);
app.use('/vehicles', vehiclesRoute);
app.use('/dvir', dvirRouter);


app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});