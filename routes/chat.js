const router = require('express').Router()
const chatCtrlr = require('../controllers/chat')
const chat = require('../controllers/chat')

router.get('/host', chatCtrlr.hostPage)
router.get('/host/:userIp', chatCtrlr.hostPage)
router.get('/:userIp', chatCtrlr.chatPage)
router.post('/:userIp/messages', chatCtrlr.addMess)
router.post('/:userIp/messages/host', chatCtrlr.hostAddMess)
router.get('/:userIp/:isAdd/:isMe', chatCtrlr.chatPage)
router.get('/host/:userIp/:isAdd/:isMe', chatCtrlr.hostPage)
router.get('/:userIp/:isAdd', chatCtrlr.chatPage)
router.get('/host/:userIp/:isAdd', chatCtrlr.hostPage)

module.exports = router