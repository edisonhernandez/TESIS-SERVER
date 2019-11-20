'use strict'
var express = require('express');
var EmergenciaController = require('../controllers/emergencia');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./descargas/emergencias'});
api.get('/probandoEmergencia', md_auth.ensureAuth, EmergenciaController.probando);
api.post('/nueva-emergencia', [md_auth.ensureAuth], EmergenciaController.nuevaEmergencia);
api.put('/actualizar-emergencia/:eid', [md_auth.ensureAuth], EmergenciaController.actualizarEmergencia);
api.delete('/borrar-emergencia/:id', [md_auth.ensureAuth], EmergenciaController.borrarEmergencia);
api.get('/obtener-emergencia/:id', EmergenciaController.obtenerEmergencia);
api.get('/obtener-emergencias/:page?', EmergenciaController.obtenerEmergencias);
api.post('/subir-foto-mascota-emergencia/:id/:eid',[md_auth.ensureAuth, md_upload],EmergenciaController.subirFotoMascotaEmergencia);
api.post('/subir-foto-direccion-emergencia/:id/:eid',[md_auth.ensureAuth, md_upload],EmergenciaController.subirFotoDireccionEmergencia);
api.get('/obtener-imagen-emergencia/:imageFile', EmergenciaController.obtenerImagenEmergencia);
api.put('/marcar-atentida-emergencia/:fid/:eid',[md_auth.ensureAuth],EmergenciaController.marcarAtentidaEmergencia);
api.put('/nueva-ayuda/:eid',[md_auth.ensureAuth],EmergenciaController.nuevaAyuda);
api.post('/filtro-emergencias/:page?',EmergenciaController.filtroEmergencias);

module.exports = api;