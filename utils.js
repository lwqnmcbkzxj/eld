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
function mQuery(query, params = []) {
    if (!_con) return;
    return new Promise((resolve, reject) => {
        _con.query(query, params, (err, result) => {
            if (err) return reject(err);
            else resolve(result);
        });
    });
}
module.exports.makeQuery = makeQuery;
module.exports.initMysqlConnection = initMysqlConnection;
module.exports.mQuery = mQuery;
///////////////////////

const checkAuth = function(req, res, next) {
    const token = req.headers.token;
    // console.log(req.body);
    makeQuery(`SELECT user_id, role_id, company_id FROM user WHERE user_token = ? and user_status <> 'DELETED'`, [ token ], (db_success) => {
        if (db_success.result.length <= 0) return res.status(401).send(makeResponse(-1, 'User Not Authorized'));
        const auth_info = {
            req_user_id: db_success.result[0].user_id,
            req_role_id: db_success.result[0].role_id,
            req_company_id: db_success.result[0].company_id
        };
        req['auth_info'] = auth_info;
        next();
    }, (db_fail) => {
        return res.status(401).send(makeResponse(-2, db_fail));
    });
};
module.exports.checkAuth = checkAuth;

async function sessionExtracter(req, res, next) {
    const req_user_id = req.auth_info.req_user_id;
    let session_id = null;
    try {
        // console.log(req.auth_info);
        const session_db = await mQuery(`select session_id from session where 
             driver_user_id = ? and session_status = 'ACTIVE' order by session_start_dt desc limit 1`, [req_user_id]);
        // console.log(session_db);
        if (session_db.length <= 0) req.auth_info['session_id'] = null;
        else {
            session_id = session_db[0].session_id;
            req.auth_info['session_id'] = session_id;
        }
    } catch (err) {
        return res.status(500).send(makeResponse(-5, err));
    }
    next();
}
module.exports.sessionExtracter = sessionExtracter;

async function companyExists(company_id) {
    try {
        const db = await mQuery(`select company_id from company where company_id = ?`, [company_id]);
        return db.length > 0;
    } catch (err) {
        throw err;
    }
}
module.exports.companyExists = companyExists;

function makeDay(dt) {
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return year + "-" + month + "-" + day;
}
module.exports.makeDay = makeDay;

function getCurDt() {
    const dt = new Date();
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    const hour = String(dt.getHours()).padStart(2, '0');
    const minute = String(dt.getMinutes()).padStart(2, '0');
    const second = String(dt.getSeconds()).padStart(2, '0');
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
module.exports.getCurDt = getCurDt;

async function getActiveSessionID(user_id) {
    try {
        const session_db = await mQuery(`select session_id from session where driver_user_id = ? and session_status = 'ACTIVE'`, [user_id]);
        return session_db[0].session_id;
    } catch (err) {
        throw err;
    }
}
module.exports.getActiveSessionID = getActiveSessionID;

function genRandomFileName() {
    return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
}
module.exports.genRandomFileName = genRandomFileName;

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

function makeUpdateString(fields, values) {
    let params = [], updates = [];
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = values[i];
        if (value) {
            params.push(value);
            updates.push(field + " = ?");
        }
    }
    return {
        params: params,
        update: updates.join(", ")
    };
}
module.exports.makeUpdateString = makeUpdateString;

async function getVehicleMakeId(vehicle_make_name) {
    if (!vehicle_make_name) return makeResponse(-3, 'Empty name');
    let db;
    try {
        db = await mQuery(`select vehicle_make_id from vehicle_make where vehicle_make_name = ?`, [ vehicle_make_name ]);
    } catch (err) {
        return makeResponse(-1, err);
    }

    if (db.length <= 0) {
        // create new vehicle_make_name in DB
        db = null;
        try {
            db = await mQuery(`insert into vehicle_make (vehicle_make_name) values (?)`, [ vehicle_make_name ]);
        } catch (err) {
            return makeResponse(-2, err);
        }
        return makeResponse(0, db.insertId );
    } else {
        // found make_id
        return makeResponse(0, db[0].vehicle_make_id );
    }
}
module.exports.getVehicleMakeId = getVehicleMakeId;

async function getVehicleModelId(vehicle_model_name) {
    if (!vehicle_model_name) return makeResponse(-3, 'Empty name');
    let db;
    try {
        db = await mQuery(`select vehicle_model_id from vehicle_model where vehicle_model_name = ?`, [ vehicle_model_name ]);
    } catch (err) {
        return makeResponse(-1, err);
    }

    if (db.length <= 0) {
        // create new vehicle_make_name in DB
        db = null;
        try {
            db = await mQuery(`insert into vehicle_model (vehicle_model_name) values (?)`, [ vehicle_model_name ]);
        } catch (err) {
            return makeResponse(-2, err);
        }
        return makeResponse(0, db.insertId );
    } else {
        // found make_id
        return makeResponse(0, db[0].vehicle_model_id );
    }
}
module.exports.getVehicleModelId = getVehicleModelId;