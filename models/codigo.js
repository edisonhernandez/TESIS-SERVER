'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CodigoSchema = Schema({
    correo:String,
    codigo:String,
    fundacion:String,
    idfundacion:{type:Schema.ObjectId, ref:'Usuario'},
    creadoEn:String,
    tipo:String
});
module.exports = mongoose.model('Codigo', CodigoSchema);