const express = require('express')
const router = express.Router()
const controller = require('../controllers/diem.controller')
router.get('/bangdiem',controller.bangdiem)
router.get('/bangdiem/search',controller.searchBangDiem)
router.get('/phieudiem',controller.phieudiem)
router.get('/phieudiem/search',controller.searchPhieuDiem)
router.get('/nhapdiem',controller.nhapdiem)
router.get('/nhapdiem/search',controller.searchLopandMonHoc)
router.get('/nhapdiem/:MASV',controller.nhapdiemSV)
router.post('/nhapdiem/postnhapdiem',controller.postNhapDiem)
router.get('/bangdiem/update/:MASV',controller.updateDiem)
router.get('/bangdiemTK',controller.bangdiemTK)
router.get('/bangdiemTK/search',controller.searchBangDiemTK)
module.exports = router