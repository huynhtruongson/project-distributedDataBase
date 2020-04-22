const sql  = require('mssql')

let config = {
  server : 'SONDEV\\MSSQLSERVER2',
  user : 'khoacntt',
  password : '123',
  database : 'QLDSV',
  option : {
    encrypt  :false
  }
} 
const conn = new sql.ConnectionPool(config)
module.exports = conn
