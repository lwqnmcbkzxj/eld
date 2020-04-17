exports.SERVER_HOST = '127.0.0.1';
exports.SERVER_PORT = 3000;

const MYSQL_HOST = '18.222.253.151';
const MYSQL_USER = 'eld_admin';
const MYSQL_PASSWORD = 'ELD831';
const MYSQL_DATABASE = 'eld_db';

exports.MYSQL_AUTH = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    insecureAuth: true
}