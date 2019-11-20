'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FotoSchema = Schema({
    name:String,
    creadoEn:String,
    estado:String
});
module.exports = mongoose.model('foto', FotoSchema);