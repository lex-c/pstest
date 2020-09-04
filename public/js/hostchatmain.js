const reqD = document.querySelector('.requestdiv')
let name
const showRequest = (nameIntsIp) => {
    name = nameIntsIp[0] ? nameIntsIp[0] : `Someone who hasn't given their name`
    reqD.innerHTML =
        `${name} is asking to chat with you; 
        they like:${nameIntsIp[1].map(int => ` ${int}`)}
        accept? <a href="/chat/host/${nameIntsIp[2]}">yes</a>`
    reqD.style.setProperty('display', 'inherit')
    reqD.offsetHeight
}