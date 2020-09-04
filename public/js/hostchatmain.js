const reqD = document.querySelector('.requestdiv')
let name
const showRequest = (nameAndIntsAndIp) => {
    name = nameAndInts[0] ? nameAndInts[0] : `Someone who hasn't given their name`
    reqD.innerHTML =
        `${name} is asking to chat with you; 
        they like:${nameAndIntsAndIp[1].map(int => ` ${int}`)}
        accept? <a href="/chat/host/${nameAndIntsAndIp[2]}">yes</a>`
    reqD.style.setProperty('display', 'inherit')
}