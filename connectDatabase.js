var mysql = require("mysql2");

module.exports = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'IBM_RCP_DATABASE'
})