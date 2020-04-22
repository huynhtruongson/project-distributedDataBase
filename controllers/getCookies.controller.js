const sql = require('mssql')
module.exports.getCookies = (req,res,next) => {
  let {username,password,server} = req.cookies
  let config = {
    server : server,
    user : username,
    password : password,
    database : 'QLDSV',
    option : {
      encrypt  :false
    }
  } 
  const conn = new sql.ConnectionPool(config)
  res.locals.conn = conn
  next()
}