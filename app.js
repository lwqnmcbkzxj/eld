var express = require('express');
const { initMysqlConnection, checkAuth } = require('./utils');



var app = express();
app.use(express.json());
initMysqlConnection(function() {}, function() {});


app.post('/login', require('./api/login.js'));
app.get('/vehicles/:company_id', [checkAuth, require('./api/vehicles.js')]);
app.post('/choose-vehicle', [checkAuth, require('./api/choose-vehicle.js')]);



app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});