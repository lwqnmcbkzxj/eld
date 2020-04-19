const { initMysqlConnection } = require('./utils');
const { BASE_DIR } = require('./const');

let express = require('express');
let app = express();

initMysqlConnection(function() {}, function() {});

//import routes
const loginRoute = require('./routes/auth/login');
const vehiclesRoute = require('./routes/vehicles');
const dvirRouter = require('./routes/dvir');
const authRouter = require('./routes/auth');

app.use('/login', loginRoute);
app.use('/vehicles', vehiclesRoute);
app.use('/dvir', dvirRouter);
app.use('/auth', authRouter);


app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});