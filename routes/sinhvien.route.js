const express = require('express')
const router = express.Router()
const controller = require('../controllers/sinhvien.controller')
router.get('/',controller.sinhvien)
router.get('/search',controller.searchLop)
router.get('/addsinhvien',controller.addsinhvien)
router.post('/addsinhvien',controller.postAddsinhvien)
router.get('/update/:MASV',controller.updateSinhVien)
module.exports = router