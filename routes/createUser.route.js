const express = require('express')
const router = express.Router()
const controller = require('../controllers/createUser.controller')
router.get('/',controller.createUser)
router.post('/',controller.postCreate)
module.exports = router