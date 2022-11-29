const bcrypt = require('bcrypt')

const checkAuth = (req, res, next) => {
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/usuarios/login')
    }
}
const isValidPassword = ( user, password) => {
    return bcrypt.compareSync(password, user.password)
}

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

module.exports = {checkAuth, isValidPassword, createHash}