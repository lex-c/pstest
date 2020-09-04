


const reqD = document.querySelector('.requestdiv')
const isUser = document.getElementById('isUser').value
const isAdd = document.getElementById('isAdd').value
const ipVal = document.getElementById('userIp').value
const me = document.getElementById('me').value
let name, intsMess




const showRequest = (nameIntsIp) => {
    console.log('getting the request')
    name = nameIntsIp[0] ? nameIntsIp[0] : `Someone who hasn't given their name`
    intsMess = nameIntsIp[1].length ? nameIntsIp[1] : 'nothing added yet'
    reqD.innerHTML =
        `${name} is asking to chat with you; 
        Their interests: ${intsMess}
        accept? <a href="/chat/host/${nameIntsIp[2]}">yes</a>`
    reqD.style.setProperty('display', 'inherit')
    reqD.offsetHeight
}