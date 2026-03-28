import mysql from 'mysql2/promise'
import dotenv  from 'dotenv'  
dotenv.config()
const pool =  mysql.createPool({ 
    host: 'localhost',
  user: 'root',
  port: 3307,
  password: '',
  database: process.env.DB_NAME})
 
  console.log("sql connecte")
 export default pool ;    

