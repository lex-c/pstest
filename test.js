// if (pic1.id === 'pic1') {
//     pic1.id = 'pic1b'
//     pic1 = document.getElementById('pic1b')
//     pic1.offsetHeight
// }
// if (pic1.id === 'pic1b') {
//     pic1.id = 'pic1'
//     pic1 = document.getElementById('pic1b')
//     pic1.offsetHeight
// }

var socket = io()
socket.emit('upInt', json({`${pic1.dataset.picId}`: p1Ct}))

// allImgs.forEach(img, i => {
//     img.setAttribute('data-picId', `${rotPics[i]._id)
//     img.setAttribute('src', `${rotPics[i].picUrl}`)