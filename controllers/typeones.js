
module.exports = {onesIndex}

function onesIndex(req, res) {
    if (!req.user) res.render('typeones/index', {title: 'Ones'})
    res.render('typeones/index', {title: 'Ones', name: req.user.name, user: req.user})
}