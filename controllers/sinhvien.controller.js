const sql = require('mssql')
// const conn = require('../conn')
module.exports.sinhvien = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    // request.query("select * from SINHVIEN where MALOP = 'ML01'",function(err,data) {
    //   if(err)
    //     console.log(err)
    //   res.render('index',{students : data.recordset})
    //   conn.close()
    // })
    let students = await request.query(`select * from SINHVIEN`)
    let lops = await request.query('select * from LOP')
    res.render('index',{students : students.recordset,lops : lops.recordset})
    conn.close()
  })
}
module.exports.searchLop =  function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let malop = req.query.malop.trim()
    let request = new sql.Request(conn)
    let currentLop = await request.query(`select * from LOP where MALOP = '${malop}'`)
    let students = await request.query(`select * from SINHVIEN where MALOP = '${malop}'`)
    // students = students.recordset.filter(x => x.MALOP == malop)
    let lops = await request.query(`select * from LOP`)
    res.render('index',{students : students.recordset,
      lops : lops.recordset,
      currentLop : currentLop.recordset[0]})
    conn.close()
  })
}

module.exports.addsinhvien =  function(req,res) {
  res.render('addsinhvien')
}
module.exports.postAddsinhvien = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    if(req.body.masvUpdate) {
      let q = `UPDATE SINHVIEN SET HO='${req.body.ho}',TEN='${req.body.ten}',
              PHAI=${parseInt(req.body.phai)},NGAYSINH='${req.body.ngaysinh}',
              NOISINH='${req.body.noisinh}',DIACHI='${req.body.diachi}',
              NGHIHOC=${parseInt(req.body.nghihoc)} WHERE MASV='${req.body.masvUpdate}'`
      conn.query(q,function(err,result) {
        if(err) {
          res.render('addsinhvien',{err : "Lỗi !"})
          return
        }
        res.redirect('/')
        conn.close()
      })
    }
    else {
      let request = new sql.Request(conn)
      request.input('MASV',sql.Char(8),req.body.masv)
      let result = await request.execute('sp_KiemTraMaSinhVienTonTai')
      if(result.returnValue === 1) {
        res.render('addsinhvien',{err : "Lỗi ! Vui lòng kiểm tra MASV"})
        return
      }
      let q = `INSERT INTO SINHVIEN 
      (MASV,HO,TEN,MALOP,PHAI,NGAYSINH,NOISINH,DIACHI,NGHIHOC) 
      VALUES 
      ('${req.body.masv}','${req.body.ho}','${req.body.ten}',
      '${req.body.malop}',${parseInt(req.body.phai)},
      '${req.body.ngaysinh}','${req.body.noisinh}',
      '${req.body.diachi}',${parseInt(req.body.nghihoc)})`
      conn.query(q,function(err,result) {
        if(err) {
          res.render('addsinhvien',{err : "Lỗi ! Vui lòng kiểm tra MASV"})
          return
        }
        res.redirect('/')
        conn.close()
      })
    }
  })
}

module.exports.updateSinhVien = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let masv = req.params.MASV
    let student = await request.query(`select * from SINHVIEN where MASV = '${masv}'`)
    let d = new Date(student.recordset[0].NGAYSINH)
    let m = d.getMonth()+1 >=10 ? (d.getMonth()+1).toString() : '0'+(d.getMonth()+1)
    let dt = d.getDate()>=10 ? d.getDate().toString() : '0'+d.getDate()
    student.recordset[0].NGAYSINH = d.getFullYear()+'-'+m+'-'+dt;
    res.render('addsinhvien',{student : student.recordset[0]})
    conn.close()
  })
}
