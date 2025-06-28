const mysql = require('mysql2/promise');
const fs = require('fs');
const path=require("path");

(async function () {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS `Ecommerce`');
  await connection.end();
  console.log('✅ Database created or already exists');
})();

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD||"",
    database: process.env.DB_NAME || 'Ecommerce',
    port: process.env.DB_PORT,
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const urldatabase=path.join(__dirname+"\\Ecommerce.sql")
  const sql=fs.readFileSync(urldatabase, 'utf8')

    pool.query(sql).then(()=>{
      console.log('✅ SQL script executed');
    });
    
    pool.query("SHOW TABLES").then(([rows]) => {
      if (rows.length === 0) 
        console.log("No tables found in the database.");
      else 
      console.log("Tables in the database:", rows);
    });
    
    
module.exports=pool;



