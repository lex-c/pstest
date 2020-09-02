const p1CD = document.getElementById('p1Count')
const p2CD = document.getElementById('p2Count')
const p3CD = document.getElementById('p3Count')
const p4CD = document.getElementById('p4Count')
const p5CD = document.getElementById('p5Count')
const p6CD = document.getElementById('p6Count')
let p1D = document.getElementById('p1D')
let p2D = document.getElementById('p2D')
let p3D = document.getElementById('p3D')
let p4D = document.getElementById('p4D')
let p5D = document.getElementById('p5D')
let p6D = document.getElementById('p6D')
let p7D = document.getElementById('p7D')
let p8D = document.getElementById('p8D')
let p9D = document.getElementById('p9D')
let p10D = document.getElementById('p10D')
const pic1 = document.getElementById('pic1')
const pic2 = document.getElementById('pic2')
const pic3 = document.getElementById('pic3')
const pic4 = document.getElementById('pic4')
const pic5 = document.getElementById('pic5')
const pic6 = document.getElementById('pic6')
const pic7 = document.getElementById('pic7')
const pic8 = document.getElementById('pic8')
const pic9 = document.getElementById('pic9')
const pic10 = document.getElementById('pic10')

const ipVal = document.getElementById('ipInp').value

let topImgs, bottomImgs

let p1Ct = p2Ct = p3Ct = p4Ct = p5Ct = p6Ct = p7Ct = p8Ct = p9Ct = p10Ct = 0

bottomImgs = document.querySelectorAll('.btm-img')
bottomImgs.forEach(img => {
    img.addEventListener('mouseover', enlarge)
})

function enlarge(e) {
    socket.disconnect()
    e.target.setAttribute('class', 'larger')
    e.target.addEventListener('mouseleave', turnOff)
    e.target.addEventListener('click', addToCart)
}

function turnOff(e) {
    e.target.setAttribute('class', 'regular')
    e.target.removeEventListener('mouseleave', turnOff)
    e.target.removeEventListener('click', addToCart)
    socket = io()
    socket.on('nextPics', putPicsIn)
}

function addToCart(e) {
    console.log('added!')
}

function putPicsIn(rotPics) {
    console.log(`in here and the rotPics are ${rotPics.map(pic => pic.apiPId)}; and ip is ${ipVal}`)
    p1Ct = p2Ct = p3Ct = p4Ct = p5Ct = p6Ct = p7Ct = p8Ct = p9Ct = p10Ct = 0
    topImgs = document.querySelectorAll('.top-img')
    bottomImgs = document.querySelectorAll('.btm-img')
    if (bottomImgs[0].dataset.picid) {
        topImgs.forEach((img, i) => {
            let pID = bottomImgs[i].dataset.picid
            let pSrc = bottomImgs[i].src
            console.log(pID, pSrc)
            img.setAttribute('data-picid', `${pID}`)
            img.setAttribute('src', `${pSrc}`)
        })
    }
    bottomImgs.forEach((img, i) => {
        img.setAttribute('data-picid', `${rotPics[i].apiPId}`)
        img.setAttribute('src', `${rotPics[i].picUrl}`)
    })
    window.scrollTo(0, `${document.body.scrollTop / 2}`) 
}