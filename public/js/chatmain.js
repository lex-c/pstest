const nmVal = document.getElementById('nmInp').value
const itVal = document.getElementById('itInp').value
const ipVal = document.getElementById('ipInp').value
const block = document.querySelector('.messblock')

const hideMess = () => {
    block.style.setProperty('display', 'none')
}

const showMess = () => {
    block.style.setProperty('display', 'initial')
}