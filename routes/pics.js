const router = require('express').Router()
const picsCtrlr = require('../controllers/pics')

router.get('/', picsCtrlr.picsIndex)

module.exports = router