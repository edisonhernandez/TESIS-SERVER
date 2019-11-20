'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MascotaSchema = Schema({
    nombre:String,
    sexo:String,
    meses:String,
    edadT:String,
    raza:String,
    tamanio:String,
    esterilizado:String,
    color:String,
    anios:String,
    especie:String,
    vacunas:{},
    descripcion:String,
    creadoEn:String,
    estado:String,
    fotos:[{
        name:String,
        creadoEn:String,
        estado:String
    }],
    responsable:{type:Schema.ObjectId, ref:'Usuario'}
});
module.exports = mongoose.model('Mascota', MascotaSchema);