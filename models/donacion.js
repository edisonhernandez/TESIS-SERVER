'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DonacionSchema = Schema({
    tipo:{type:String, enum:['economica','producto']},
    fundacion:{type:Schema.ObjectId, ref:'Usuario'},
    donante:{
        nombres:String,
        apellidos:String,
        cedula:String,
        direccion:String,
        telefono:String,
        celular:String
    },


    comprobante:String,
    cantidad:String,
    nombreProducto:String,
    descripcion:String,
    creadoEn:String,

    donanteR:{type:Schema.ObjectId, ref:'Usuario'},
    
    voluntarios:[{
        voluntario:{type:Schema.ObjectId, ref:'Usuario'},
        estado:String
    }],
    estado:String,
});
module.exports = mongoose.model('Donacione', DonacionSchema);

