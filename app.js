const { initMysqlConnection, checkAuth } = require('./utils');
const { BASE_DIR } = require('./const');

var express = require('express');
var bodyParser = require('body-parser');
let multer = require('multer');

var app = express();
let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({ extended: true });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// app.use(express.json());
initMysqlConnection(function() {}, function() {});


app.post('/login', urlencodedParser, require('./api/login'));
app.get('/vehicles/:company_id', [checkAuth, require('./api/vehicles')]);
app.post('/choose-vehicle', urlencodedParser, [checkAuth, require('./api/choose-vehicle')]);

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/home/ubuntu/simply-eld/simply-eld/uploads');
  },
  // filename: function(req, file, cb) {
  //   cb(null, file.originalname);
  // }
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});
app.post('/add-dvir', upload.single('signature'), [checkAuth, require('./api/add-dvir')]);


app.listen(3000, function() {
  console.log("Listening to port 3000 ...");
});