'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AyudaSchema = Schema({
    fundacion:{type:Schema.ObjectId, ref:'Usuario'},
    voluntarios:[{
        voluntarioId:{type:Schema.ObjectId, ref:'Usuario'},
        aprobado:String
    }],
    emergencia:{type:Schema.ObjectId, ref:'Emergencia'},
    creadoEn:String,
    aprobado:String
});
module.exports = mongoose.model('Ayuda', AyudaSchema);