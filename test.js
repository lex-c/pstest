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

// var socket = io()
// socket.emit('upInt', json({`${pic1.dataset.picId}`: p1Ct}))

// allImgs.forEach(img, i => {
//     img.setAttribute('data-picId', `${rotPics[i]._id)
//     img.setAttribute('src', `${rotPics[i].picUrl}`)
// const re = /[A-Za-z]{3,}(?<!his|and|the|composition|over|background|with|many|much|lots)\b/gmi
// const reRes = 'Successful businessman at the office leading a group Diverse People Friendship Togetherness Happiness Aerial View Concept Many faces wall composition Group of happy young  business people in a meeting at office Smiling businessman talking to his workmate in bright office Group of friends with thumbs up Businesswoman showing a laptop screen Businessman celebrating his success and jumping over gray background'
// console.log([...reRes.matchAll(re)].map(res => res[0]))

allImgs = document.querySelectorAll('.inact-imgs')
allImgs.forEach((img, i) => {
    img.setAttribute('id', `${i + 1}`)
})