let jwt = require("jsonwebtoken")


function verifyToken(req,res,next) {

let token = req.cookies.token || ''

console.log(token)
// Si no hay token
if(!token) {
    return res.redirect("/login")
}

// En caso de si tener un token
else {

// Validar el token

jwt.verify(token,process.env.SECRETO, function(err, datos){

if  (err){
    console.log(err)
    return res.redirect("/login")
}
else {

    req.userId = datos.id
    next()
}


})

}}

module.exports = verifyToken