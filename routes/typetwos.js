const express = require('express')
const router = express.Router()
const twosCtrlr = require('../controllers/typetwos')

router.get('/', twosCtrlr.twosIndex)

module.exports = router