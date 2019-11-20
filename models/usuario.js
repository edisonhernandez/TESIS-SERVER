'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({

    nombres:String,
    apellidos:String,
    fechaNacimiento:String,
    correo:String,
    password:String,
    passwordTemp:String,
    telefono:Number,
    celular:Number,
    cedula:String,
    direccion:String,
    calleP:String,
    calleS:String,
    representante:String,
    sector:String,
    barrio:String,
    tipoVoluntario:String,
    disponibilidadTiempo:String,
    disponibilidadCasa:String,
    disponibilidadParticipacion:String,
    rol:String,
    foto:String,
    perfil:String,
    mision:String,
    vision:String,
    logo:String,
    nombreFundacion:String,
    link:String,
    fechaFundacion:String,
    creadoEn:String,
    estado:String,
    correoVerificado:Boolean,
    titular:String,
    banco:String,
    numCuenta:String,
    pfundacion:{type:Schema.ObjectId, ref:'Usuario'},

    historias:[{
        titulo:String,
        descripcion:String,
        foto:String,
        creadoEn:String
    }]


});
module.exports = mongoose.model('Usuario', UserSchema);