const express = require('express')
const router = express.Router()
const controller = require('../controllers/lop.controller')
router.get('/',controller.lop)
router.get('/addlop',controller.addlop)
router.post('/addlop',controller.postAddLop)
router.get('/update/:MALOP',controller.updateLop)
module.exports = router