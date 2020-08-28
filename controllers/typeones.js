
module.exports = {onesIndex}

function onesIndex(req, res) {
    if (!req.user) res.render('typeones/index', {title: 'Ones' , ip: req.connection.remoteAddress})
    res.render('typeones/index', {title: 'Ones', name: req.user.name, user: req.user, ip: req.connection.remoteAddress})
}