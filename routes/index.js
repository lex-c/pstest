const router = require('express').Router()
const indexCtrlr = require('../controllers/index')

router.get('/', indexCtrlr.index)

module.exports = router


