const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost", // Change this if using a remote DB
  user: "root", // Your MySQL username
  password: "", // Your MySQL password
  database: "todo", // Your database name
});

pool.getConnection((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = pool;
