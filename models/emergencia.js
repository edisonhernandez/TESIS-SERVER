'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmergenciaSchema = Schema({
    tipoEmergencia:String,
    nivelEmergencia:String,
    sexoMascota:String,
    raza:String,
    estadoMascota:String,
    tipoMascota:String,
    fotoMascota:String,
    direccionSector:String,
    direccionCprincipal:String,
    direccionCsecundaria:String,
    direccionReferencia:String,
    direccionFoto:String,
    contactoExtra:Number,
    descripcion:String,
    creadoEn:String,
    estado:String,
    responsable:{type:Schema.ObjectId, ref:'Usuario'},
    ayuda:{
        fundacion:{type:Schema.ObjectId, ref:'Usuario'},
        voluntarios:[{
            voluntarioId:{type:Schema.ObjectId, ref:'Usuario'},
            aprobado:String
        }],
    }
});
module.exports = mongoose.model('Emergencia', EmergenciaSchema);