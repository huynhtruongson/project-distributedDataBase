const sql = require('mssql')

module.exports.login = function(req,res) {
  res.render('login')
}

module.exports.postLogin = function(req,res) {
  let { server,username,pwd } = req.body
  let config = {
    server : server,
    user : username,
    password : pwd,
    database : 'QLDSV',
    option : {
      encrypt  :false
    }
  } 
  const conn = new sql.ConnectionPool(config)
  conn.connect((err) => {
    if(err) {
      res.render('login',{errs : "Vui lòng kiểm tra username và password",username : username})
      conn.close()
      return
    }
    else {
      res.cookie('username',username)
      res.cookie('password',pwd)
      res.cookie('server',server)
    }
    conn.close()
    res.redirect('/')
  })
  
}