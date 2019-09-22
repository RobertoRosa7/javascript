// require mysql2
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host:'localhost',
    user:'kakashi',
    database:'saboroso',
    password:'123765',
    // habilitar multiplus comando de SQL
    multipleStatements: true
});

// export module to request
module.exports = connection;