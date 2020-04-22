const sql = require('mssql')
// const conn = require('../conn')

module.exports.monhoc = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let data = await request.query('select * from MONHOC')
    res.render('monhoc',{monhocs : data.recordset})
    conn.close()
  })
}

module.exports.addmonhoc = function(req,res) {
  res.render('addmonhoc')
}

module.exports.postAddMonhoc = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let q =``
    if(req.body.mamhUpdate) 
      q = `UPDATE MONHOC SET TENMH = '${req.body.tenmh}' 
      WHERE MAMH = '${req.body.mamhUpdate}'`
    else
      q = `INSERT INTO MONHOC
      (MAMH,TENMH) 
      VALUES 
      ('${req.body.mamh}','${req.body.tenmh}')`
    conn.query(q,function(err,result) {
      if(err) {
        res.render('addmonhoc',{err : "Lỗi ! Vui lòng kiểm tra MAMH"})
        return
      }
      res.redirect('/monhoc')
      conn.close()
    })
  })
}

module.exports.updateMonHoc = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let mamh = req.params.MAMH
    let monhoc = await request.query(`select * from MONHOC where MAMH = '${mamh}'`)
    res.render('addmonhoc',{monhoc : monhoc.recordset[0]})
    conn.close()
  })
}