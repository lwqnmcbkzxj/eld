var express = require('express');
const { initMysqlConnection, checkAuth } = require('./utils');



var app = express();
app.use(express.json());
initMysqlConnection(function() {}, function() {});


app.get('/vehicles/:company_id', [checkAuth, require('./api/vehicles.js')]);
app.post('/login', require('./api/login.js'));


app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});