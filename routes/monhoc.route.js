const express = require('express')
const router = express.Router()
const controller = require('../controllers/monhoc.controller')
router.get('/',controller.monhoc)
router.get('/addmonhoc',controller.addmonhoc)
router.post('/addmonhoc',controller.postAddMonhoc)
router.get('/update/:MAMH',controller.updateMonHoc)
module.exports = router