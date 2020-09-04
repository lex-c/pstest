var sBtn = document.getElementById('uQIBtn')
var sInp = document.getElementById('uQInp')
var p1D = document.getElementById('p1D')
var p2D = document.getElementById('p2D')
var p3D = document.getElementById('p3D')
var p4D = document.getElementById('p4D')
var p5D = document.getElementById('p5D')
var p6D = document.getElementById('p6D')
var p7D = document.getElementById('p7D')
var p8D = document.getElementById('p8D')
var p9D = document.getElementById('p9D')
var p10D = document.getElementById('p10D')
var p11D = document.getElementById('p11D')
var p12D = document.getElementById('p12D')
var p13D = document.getElementById('p13D')
var p14D = document.getElementById('p14D')
var p15D = document.getElementById('p15D')
var p16D = document.getElementById('p16D')
var p17D = document.getElementById('p17D')
var p18D = document.getElementById('p18D')
var p19D = document.getElementById('p19D')
var p20D = document.getElementById('p20D')
var pic1 = document.getElementById('pic1')
var pic2 = document.getElementById('pic2')
var pic3 = document.getElementById('pic3')
var pic4 = document.getElementById('pic4')
var pic5 = document.getElementById('pic5')
var pic6 = document.getElementById('pic6')
var pic7 = document.getElementById('pic7')
var pic8 = document.getElementById('pic8')
var pic9 = document.getElementById('pic9')
var pic10 = document.getElementById('pic10')
var pic11 = document.getElementById('pic11')
var pic12 = document.getElementById('pic12')
var pic13 = document.getElementById('pic13')
var pic14 = document.getElementById('pic14')
var pic15 = document.getElementById('pic15')
var pic16 = document.getElementById('pic16')
var pic17 = document.getElementById('pic17')
var pic18 = document.getElementById('pic18')
var pic19 = document.getElementById('pic19')
var pic20 = document.getElementById('pic20')
const ftBin = document.querySelector('footer')
const bin = document.getElementById('binShow')
const allImgs = document.querySelectorAll('img')

const ipVal = document.getElementById('ipInp').value
const gID = document.getElementById('gIDInp').value

let topImgs, bottomImgs, divNode
let delDivs

topImgs = document.querySelectorAll('.top-img')
bottomImgs = document.querySelectorAll('.btm-img')

setTimeout(() => allImgs.forEach(img => img.addEventListener('mouseover', enlarge)), 4000)


ftBin.addEventListener('mouseover', opacify)
ftBin.addEventListener('click', showBin)
sInp.addEventListener('focus', () => {
    socket.disconnect()
    sInp.addEventListener('blur', () => {
        socket = io()
        socket.on('isLogged', () => ftBin.style.setProperty('display', 'flex'))
        socket.on('nextPics', putPicsIn)
    })
    sBtn.addEventListener('click', sendPicsQuery)
})
function sendPicsQuery(e) {
    socket = io()
    socket.emit('customQuery', [ipVal, sInp.value])
}


function opacify(e) {
    e.target.classList.add('opaque')
    e.target.offsetHeight
    e.target.addEventListener('mouseleave', clarify)
}
function clarify(e) {
    e.target.classList.remove('opaque')
    e.target.removeEventListener('mouseleave', clarify)
}
function showBin(e) {
    allImgs.forEach(img => img.removeEventListener('mouseover', enlarge))
    ftBin.style.setProperty('display', 'none')
    socket.emit('showBin', ipVal)
    socket.on('heresBin', binPics => {
        socket.disconnect()
        bin.style.setProperty('display', 'none')
        bin.innerHTML = ''
        if ([...binPics].length) {
            binPics.forEach(pic => {
                let bPD = document.createElement('div')
                bPD.innerHTML =
                    `<img src="${pic.picUrl}" data-picid="${pic.apiPId}"><div class="del-pic" data-ip="${ipVal}" data-picid="${pic.apiPId}">X</div>`
                bin.appendChild(bPD)
            })
            delDivs = document.querySelectorAll('.del-pic')
            delDivs.forEach(div => div.addEventListener('click', removePic))
            bin.style.setProperty('display', 'flex')
            bin.addEventListener('mouseleave', hideBin)
        } else {
            ftBin.style.setProperty('display', 'flex')
            socket = io()
            socket.on('isLogged', () => ftBin.style.setProperty('display', 'flex'))
            socket.on('nextPics', putPicsIn)
            allImgs.forEach(img => img.addEventListener('mouseover', enlarge))
        }
    })
}
function removePic(e) {
    socket = io()
    socket.emit('removePic', [e.target.dataset.ip, e.target.dataset.picid])
    socket.on('disconnect', () => {
        socket = io()
        showBin()
    })
}

function hideBin(e) {
    bin.style.setProperty('display', 'none')
    bin.innerHTML = ''
    ftBin.style.setProperty('display', 'flex')
    socket = io()
    socket.on('isLogged', () => ftBin.style.setProperty('display', 'flex'))
    socket.on('nextPics', putPicsIn)
    allImgs.forEach(img => img.addEventListener('mouseover', enlarge))
}


function enlarge(e) {
    socket.disconnect()
    e.target.classList.add('larger')
    e.target.offsetHeight
    e.target.addEventListener('mouseleave', turnOff)
    e.target.addEventListener('click', addToCart)
}

const turnOff = (e) => {
    e.target.classList.remove('larger')
    e.target.innerHTML = ''
    e.target.removeEventListener('mouseleave', turnOff)
    e.target.removeEventListener('click', addToCart)
    socket = io()
    socket.on('isLogged', () => ftBin.style.setProperty('display', 'flex'))
    socket.on('nextPics', putPicsIn)
}

const addToCart = (e) => {
    socket = io()
    socket.emit('picToBin', [ipVal, e.target.dataset.picid])
}

const putPicsIn = (rotPics) => {
    topImgs = document.querySelectorAll('.top-img')
    bottomImgs = document.querySelectorAll('.btm-img')
    if (bottomImgs[0].dataset.picid) {
        topImgs.forEach((img, i) => {
            let pID = bottomImgs[i].dataset.picid
            let pSrc = bottomImgs[i].src
            img.setAttribute('data-picid', `${pID}`)
            img.setAttribute('src', `${pSrc}`)
        })
    }
    bottomImgs.forEach((img, i) => {
        img.setAttribute('data-picid', `${rotPics[i].apiPId}`)
        img.setAttribute('src', `${rotPics[i].picUrl}`)
    })
    pic20.scrollIntoView()
}