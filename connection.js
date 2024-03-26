const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "241268",
  database: "hospital",
});

module.exports = con;
