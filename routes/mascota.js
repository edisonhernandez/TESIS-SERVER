'use strict'
var express = require('express');
var MascotaController = require('../controllers/mascota');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./descargas/mascotas'});


api.get('/probando', md_auth.ensureAuth, MascotaController.probando);
api.post('/nueva-mascota/:id', md_auth.ensureAuth, MascotaController.nuevaMascota);
api.get('/obtener-mascota/:id', MascotaController.obtenerMascota);
api.get('/obtener-mascotas/:page?', MascotaController.obtenerMascotas);
api.get('/obtener-mis-mascotas/:id?/:page?', MascotaController.obtenerMisMascotas);
api.post('/subir-foto-mascota/:mid',[md_upload],MascotaController.subirFotoMascota);
api.put('/actualizar-mascota/:id/:mid',[md_auth.ensureAuth],MascotaController.actualizarMascota);
api.delete('/eliminar-mascota/:id',[md_auth.ensureAuth],MascotaController.borrarMascota);
//api.put('/desactivar-mascota/:id/:mid',[md_auth.ensureAuth],MascotaController.desactivarMascota);
api.get('/obtener-foto-mascota/:imageFile',MascotaController.obtenerImagenMascota);
api.get('/obtener-fotos-mascota/:id?',MascotaController.obtFotosMascota);
api.post('/subir-foto-mascota-nueva/:mid',[md_upload],MascotaController.subirFotoNuevaMascota);
api.delete('/eliminar-foto-mascota/:mid/:id/:file_path',[md_auth.ensureAuth],MascotaController.eliminarFotoMascota);
api.get('/seleccionFP/:mid/:idF',MascotaController.actualizarFPMascota);
api.post('/filtro-mascotas/:page?',MascotaController.filtroMascotas);
api.post('/filtro-mascotas2/:id/:page?',MascotaController.filtroMascotas2);

api.put('/eliminar-mascota-estado/:id',[md_auth.ensureAuth],MascotaController.eliminarMascotaEstado);

module.exports = api;