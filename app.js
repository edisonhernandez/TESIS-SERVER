'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require ('cors'); 
//cargar rutas
 var user_routes = require('./routes/usuario');
 var mascota_routes = require('./routes/mascota');
 var emergencia_routes = require('./routes/emergencia');
 var donacion_routes = require('./routes/donacion');
 var ayuda_routes = require('./routes/ayuda');
 var adopcion_routes = require('./routes/adopcion');
 var notificacion_routes = require('./routes/notificacion');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //cambiar a json

//cors
app.use(cors());
/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});
*/

//rutas
app.use('/api',user_routes);
app.use('/api',mascota_routes);
app.use('/api',emergencia_routes);
app.use('/api',donacion_routes);
app.use('/api',ayuda_routes);
app.use('/api',adopcion_routes);
app.use('/api',notificacion_routes);

//exportar
module.exports = app;