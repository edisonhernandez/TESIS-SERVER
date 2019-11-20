'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FotoFundacionSchema = Schema({
    foto:String,
    creadoEn:String,
    idFundacion:{type:Schema.ObjectId, ref:'Usuario'},
    mensaje1:String,
    mensaje2:String,
    orden:Number
});
module.exports = mongoose.model('portadasFundacione', FotoFundacionSchema);