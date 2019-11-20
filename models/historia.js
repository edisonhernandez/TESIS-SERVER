'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HistoriaSchema = Schema({
    titulo:String,
    descripcion:String,
    foto:String,
    creadoEn:String,
    pfundacion:{type:Schema.ObjectId, ref:'Usuario'}
    
});
module.exports = mongoose.model('historia', HistoriaSchema);