const mysql = require('mysql');
const { MYSQL_AUTH } = require('./config.js');
const { INCORRECT_QUERY, AUTH_FAILED } = require('./const.js');


var _con;
function initMysqlConnection(onSuccess, onError){
    // console.log("initMysqlConnection started");
    _con = mysql.createConnection( MYSQL_AUTH );
    // console.log("initMysqlConnection continues");
    _con.connect( err => {
        if(err && onError) onError( { status: 'error', text: err.sqlMessage } );
        else onSuccess();
    });
}
function makeQuery(query, params = [], onSuccess, onError){
    // console.log('Make Query Started');
    if(!_con) return;
    // console.log('Make Query Continue');
    _con.query(query, params, (err, result) => {
        if(err) onError && onError({ status: 'error', text: err.sqlMessage/*'Internal error'*/ });
        else onSuccess && onSuccess({ status: 'ok', result } );
    });
}
module.exports.makeQuery = makeQuery;
module.exports.initMysqlConnection = initMysqlConnection;

///////////////////////

const checkAuth = function(req, res, next) {
    const token = req.headers.token;
    // console.log("Token: " + token);
    // console.log("In checkAuth");
    makeQuery(`SELECT user_id, role_id FROM user WHERE user_token = ?`, [ token ], (db_success) => {
        // console.log("Length found: " + db_success.result.length);
        if (db_success.result.length <= 0) return res.send(makeResponse(-1, 'User Not Authorized'));
        // console.log("Before calling next() ... ");
        next();
    }, (db_fail) => {
        return res.send(makeResponse(-2, 'Unexpected Error During Auth'));
    });
};
module.exports.checkAuth = checkAuth;

//////////////////////

function parseGetParams(query){
    const _parse = () => query.split('&').reduce( (params, p) => {
        var _p = p.split('=');
        params[ decodeURIComponent( _p[0] ) ] = decodeURIComponent( _p[1] );
        return params;
    }, {});
    return typeof query == 'string' ? _parse() : {};
}
module.exports.parseGetParams = parseGetParams;

//////////////////////

function getSqlTimestamp(date){
    return (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
function parseDateInterval(from = '', to = '', defaultInterval = 60*60*24*1000){
    fromDate = new Date( parseInt( decodeURIComponent(from) ) );
    toDate = new Date( parseInt( decodeURIComponent(to) ) );

    /*if(fromDate != 'Invalid Date' && toDate != 'Invalid Date'){
      //
    } else if(fromDate != 'Invalid Date' && toDate == 'Invalid Date'){
      toDate = new Date(fromDate.valueOf() + defaultInterval);
    } else if(fromDate == 'Invalid Date' && toDate != 'Invalid Date'){
      fromDate = new Date(toDate.valueOf() - defaultInterval);
    } else {
      toDate = new Date();
      fromDate = new Date(toDate.valueOf() - defaultInterval);
    }*/
    if(fromDate == 'Invalid Date' || toDate == 'Invalid Date'){
        toDate = new Date();
        fromDate = new Date(toDate.valueOf() - defaultInterval);
    }

    return [getSqlTimestamp(fromDate), getSqlTimestamp(toDate)];
}
module.exports.parseDateInterval = parseDateInterval;

function makeResponse(status, obj) {
    return {status: status, result: obj};
}
module.exports.makeResponse = makeResponse;