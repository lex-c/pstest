const express = require('express')
const router = express.Router()
const onesCtrlr = require('../controllers/typeones')

router.get('/', onesCtrlr.onesIndex)

module.exports = router