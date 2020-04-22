const sql = require('mssql')
// const conn = require('../conn')

module.exports.lop = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let data = await request.query('select * from LOP')
    res.render('lop',{lops : data.recordset})
    conn.close()
  })
}

module.exports.addlop = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let makhoa = await request.query(`select MAKH from KHOA`)
    res.render('addlop',{makhoa : makhoa.recordset[0].MAKH.trim()})
  })
}
module.exports.postAddLop = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    if(req.body.malopUpdate) {
      let q = `UPDATE LOP SET TENLOP = '${req.body.tenlop}' 
      WHERE MALOP = '${req.body.malopUpdate}'`
      conn.query(q,function(err,result) {
        if(err) {
          res.render('addlop',{err : "Lỗi !"})
          return
        }
        res.redirect('/lop')
        conn.close()
      })
    }
    else {
      let request = new sql.Request(conn)
      request.input('MALOP',sql.Char(8),req.body.malop)
      let result = await request.execute('sp_KiemTraMaLopTonTai')
      let makhoa = await request.query(`select MAKH from KHOA`)
      if(result.returnValue === 1 || req.body.makh !== makhoa.recordset[0].MAKH.trim()) {
        res.render('addlop',{err : "Lỗi ! Vui lòng kiểm tra MALOP và MAKH",
        makhoa : makhoa.recordset[0].MAKH.trim()})
        return
      }
      let q = `INSERT INTO LOP 
      (MALOP,TENLOP,MAKH) 
      VALUES 
      ('${req.body.malop}','${req.body.tenlop}','${req.body.makh}')`
      conn.query(q,function(err,result) {
        if(err) {
          res.render('addlop',{err : "Lỗi ! Vui lòng kiểm tra MALOP và MAKH",
          makhoa : makhoa.recordset[0].MAKH.trim()})
          return
        }
        res.redirect('/lop')
        conn.close()
      })
    }
  })
}

module.exports.updateLop = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let malop = req.params.MALOP
    let lop = await request.query(`select * from LOP where MALOP = '${malop}'`)
    res.render('addlop',{lop : lop.recordset[0]})
    conn.close()
  })
}