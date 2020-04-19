mysql = require('mysql');
const { MYSQL_AUTH } = require('./config.js');


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
    // console.log(req.body);
    makeQuery(`SELECT user_id, role_id, company_id FROM user WHERE user_token = ?`, [ token ], (db_success) => {
        if (db_success.result.length <= 0) return res.status(401).send(makeResponse(-1, 'User Not Authorized'));
        const auth_info = {
            req_user_id: db_success.result[0].user_id,
            req_role_id: db_success.result[0].role_id,
            req_company_id: db_success.result[0].company_id
        };
        req['auth_info'] = auth_info;
        next();
    }, (db_fail) => {
        return res.status(401).send(makeResponse(-2, 'Unexpected Error During Auth'));
    });
};
module.exports.checkAuth = checkAuth;

//////////////////////

function getSqlTimestamp(date){
    return (date.getYear() + 1900) + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
function parseDateInterval(from = '', to = '', defaultInterval = 60*60*24*1000){
    fromDate = new Date( parseInt( decodeURIComponent(from) ) );
    toDate = new Date( parseInt( decodeURIComponent(to) ) );

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