const sql = require('mssql')
module.exports.createUser = (req,res) => {
  res.render('createUser')
}
module.exports.postCreate = (req,res) => {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let {username,pwd,role} = req.body
    let request = new sql.Request(conn)
    request.input('LGNAME',sql.VarChar(50),username)
    request.input('PASS',sql.VarChar(50),pwd)
    request.input('USERNAME',sql.VarChar(50),username)
    request.input('ROLE',sql.VarChar(50),role)
    let result = await request.execute('sp_TaoTaiKhoan').catch(err => {
      res.render('createUser',{errs : "Bạn không được cấp quyền này !"})
      conn.close()
      return
    })
    if(result.returnValue === 0) {
      res.render('createUser',{success : "Tạo Tài Khoản Thành Công !"})
      conn.close()
      return 
    }
  })
}