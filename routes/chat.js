const router = require('express').Router()
const chatCtrlr = require('../controllers/chat')

router.get('/host', chatCtrlr.hostPage)
router.get('/host/:userIp', chatCtrlr.hostPage)
router.get('/:userIp', chatCtrlr.chatPage)
router.post('/:userIp/messages', chatCtrlr.addMess)
router.post('/:userIp/messages/host', chatCtrlr.hostAddMess)

module.exports = router