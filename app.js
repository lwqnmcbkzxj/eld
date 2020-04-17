const { makeQuery, initMysqlConnection, makeResponse, checkAuth } = require('./utils');

var express = require('express');

var app = express();
app.use(express.json());
initMysqlConnection(function() {}, function() {});


app.get('/vehicles/:company_id', [checkAuth, require('./api/vehicles.js')]);
app.post('/login', require('./api/login.js'));


app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});