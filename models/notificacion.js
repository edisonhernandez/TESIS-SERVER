'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NotificacionSchema = Schema({
    estado:String,
    mensaje:String,
    creadoEn:String,
    tipo:{type:String, enum:['emergencia','nfundacion','ayuda','adopcion','donacion']},
   
    de:{type:Schema.ObjectId, ref:'Usuario'},
    adopcion:String,
    donacion:String,
    fundacion:{type:Schema.ObjectId, ref:'Usuario'},
    emergencia:{type:Schema.ObjectId, ref:'Emergencia'},
    para:[{
        voluntarioId:{type:Schema.ObjectId, ref:'Usuario'},
    }],
    mascota:{type:Schema.ObjectId, ref:'Mascota'}
});
module.exports = mongoose.model('Notificacione', NotificacionSchema);