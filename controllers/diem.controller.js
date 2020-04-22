const sql = require('mssql')
// const conn = require('../conn')
module.exports.bangdiem = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let lops = await request.query('select * from LOP')
    let monhocs = await request.query(`select * from MONHOC`)
    res.render('bangdiem',{lops : lops.recordset,monhocs : monhocs.recordset})
    conn.close()
  })
}

module.exports.searchBangDiem = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let malop = req.query.malop.trim()
    let mamonhoc = req.query.mamonhoc.trim()
    let lan = req.query.lan
    let currentLop = await request.query(`select * from LOP where MALOP = '${malop}'`)
    let currentMonhoc =  await request.query(`select * from MONHOC where MAMH = '${mamonhoc}'`)
    let currentInfo = {
      lop : currentLop.recordset[0].TENLOP,
      monhoc : currentMonhoc.recordset[0].TENMH,
      lan : lan
    }
    let lops = await request.query('select * from LOP')
    let monhocs = await request.query(`select * from MONHOC`)
    let students = await request.query(`
    select DIEM.MASV,HO,TEN,LOP.MALOP,MAMH,DIEM 
    from SINHVIEN,LOP,DIEM 
    where SINHVIEN.MASV = DIEM.MASV AND SINHVIEN.MALOP = LOP.MALOP AND MAMH = '${mamonhoc}' 
    AND LAN =${lan} AND LOP.MALOP ='${malop}'`)
    res.render('bangdiem',{lops : lops.recordset,
      monhocs : monhocs.recordset,
      students : students.recordset,
      currentInfo : currentInfo})
    conn.close()
  })
}

module.exports.phieudiem = function(req,res) {
  res.render('phieudiem')
}
module.exports.searchPhieuDiem =  function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let masv = req.query.masv.trim()
    let students = await request.query(`select * from SINHVIEN where MASV = '${masv}'`)
    let infos = await request.query(`select DIEM.MAMH,TENMH,MAX(DIEM) as DIEM
     from DIEM,MONHOC
     where DIEM.MAMH = MONHOC.MAMH AND MASV = '${masv}' GROUP BY DIEM.MAMH,TENMH`)
    res.render('phieudiem',{student : students.recordset[0],infos : infos.recordset})
    conn.close()
  })
}

module.exports.nhapdiem = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    // let students = await request.query(`select * from SINHVIEN`)
    let lops = await request.query('select * from LOP')
    let monhocs = await request.query('select * from MONHOC')
    res.render('nhapdiem',{
      lops : lops.recordset,
      monhocs : monhocs.recordset})
    conn.close()
  })
}

module.exports.searchLopandMonHoc =  function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let malop = req.query.malop.trim()
    let mamonhoc = req.query.mamonhoc.trim()
    let q = ` 
    SELECT * FROM SINHVIEN
    WHERE NOT EXISTS 
    (SELECT MASV FROM DIEM WHERE SINHVIEN.MASV = DIEM.MASV AND DIEM.MAMH ='${mamonhoc}')
     AND MALOP = '${malop}'`
    let currentLop = await request.query(`select * from LOP where MALOP = '${malop}'`)
    let currentMonhoc = await request.query(`select * from MONHOC where MAMH = '${mamonhoc}'`)
    let currentInfo = {
      lop : currentLop.recordset[0].TENLOP,
      monhoc : currentMonhoc.recordset[0].TENMH
    }
    let students = await request.query(q)
    let lops = await request.query(`select * from LOP`)
    let monhocs = await request.query('select * from MONHOC')
    res.render('nhapdiem',{students : students.recordset,
      lops : lops.recordset,
      monhocs : monhocs.recordset,
      currentInfo : currentInfo})
    conn.close()
  })
}

module.exports.nhapdiemSV = function(req,res) {
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let monhocs = await request.query('select * from MONHOC')
    let masv = req.params.MASV
    res.render('nhapdiemSV',{monhocs : monhocs.recordset,masv : masv})
    conn.close()
  })
}

module.exports.postNhapDiem = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    // let request = new sql.Request(conn)
    let masv = req.body.masv.trim()
    let mamonhoc = req.body.mamonhoc.trim()
    let diem1 = req.body.diem1.trim()
    let diem2 = req.body.diem2.trim()
    // let q = "INSERT INTO DIEM (MASV, MAMH, LAN,   DIEM) VALUES ? "
    // UPDATE
    if(req.body.masvDiemUpdate) {
      let q1 = `UPDATE DIEM SET DIEM = ${diem1} 
      WHERE MASV = '${masv}' AND MAMH = '${mamonhoc}' AND LAN = 1`
      let q = q1
      if(diem2)
        q += `UPDATE DIEM SET DIEM = ${diem2} 
        WHERE MASV = '${masv}' AND MAMH = '${mamonhoc}' AND LAN = 2`
      conn.query(q,function(err,result) {
        if(err) {
          res.render('nhapdiemSV',{err : "Lỗi !"})
          return
        }
        res.redirect('/diem/bangdiem')
        conn.close()
      })
    }
    // INSERT
    else {
      let q1 = `INSERT INTO DIEM 
      (MASV,MAMH,LAN,DIEM) 
      VALUES
      ('${masv}','${mamonhoc}',1,${diem1})`
      let q2 = ``
      if(diem2)
        q2 = `INSERT INTO DIEM 
        (MASV,MAMH,LAN,DIEM) 
        VALUES
        ('${masv}','${mamonhoc}',2,${diem2})`
      else
        q2 = `INSERT INTO DIEM 
        (MASV,MAMH,LAN,DIEM) 
        VALUES
        ('${masv}','${mamonhoc}',2,null)`
      let q = q1+q2
      conn.query(q,function(err,result) {
        if(err) {
          res.render('nhapdiem',{err : "Lỗi !"})
          return
        }
        res.redirect('/diem/nhapdiem')
        conn.close()
      })
    }
  })
}

module.exports.updateDiem = function(req,res) {
  const conn = res.locals.conn
  conn.connect(async function(err) {
    if(err)
      console.log(err)
    let request = new sql.Request(conn)
    let monhocs = await request.query('select * from MONHOC')
    let masvUpdateDiem = req.params.MASV
    res.render('nhapdiemSV',{monhocs : monhocs.recordset,
                            masvUpdateDiem : masvUpdateDiem})
    conn.close()
  })
}
