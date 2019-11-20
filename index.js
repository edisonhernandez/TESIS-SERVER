'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800; 
//conexion a la BDD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.1.7:27017/sistemaFundaciones')
.then(()=>{
    console.log("Conexion con la BDD exitosa");

    //crear servidor
    app.listen(port,()=>{
        console.log('Servidor creado exitosamente en, http://192.168.1.7:3800');
    })

}).catch(err=> console.log(err));