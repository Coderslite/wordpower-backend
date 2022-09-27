const mysql = require('mysql');

const con = mysql.createConnection({
    "host": "localhost",
    "user": "activegl_abgreat",
    "password": "Mesomorph_11",
    "database": "activegl_e-library"
})

module.exports = con;