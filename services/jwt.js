'use strict'
var jwt =  require('jwt-simple');
var moment = require('moment');
var secret = 'clave';
exports.createToken = function(usuario){
    //objeto con los datos del usuario que se quiere codificar dentro del token
    var payload = {
        sub: usuario._id,
        cedula:usuario.cedula,
        nombres:usuario.nombres,
        apellidos:usuario.apellidos,
        fechaNacimiento:usuario.fechaNacimiento,
        correo:usuario.correo,
        rol:usuario.rol,
        foto:usuario.foto,
        direccion:usuario.direccion,
        telefono:usuario.telefono,
        celular:usuario.celular,
        iat:moment().unix(),
        exp:moment().add(30,'days').unix

    }
    console.log(payload)
    return jwt.encode(payload, secret);
}

