'use strict'
var express = require('express');
var DonacionController = require('../controllers/donacion');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./descargas/donaciones'});

api.get('/probandoDonacion', md_auth.ensureAuth, DonacionController.probando);
api.post('/nueva-donacion/:tipo', md_auth.ensureAuth, DonacionController.nuevaDonacion);
api.get('/obtener-donacion/:id', DonacionController.obtenerDonacion);
api.get('/obtener-donaciones/:id/:page?', md_auth.ensureAuth, DonacionController.obtenerDonaciones);
api.post('/subir-comprobante/:did', [md_auth.ensureAuth,md_upload], DonacionController.subirComprobante);
api.get('/obtener-comprobante/:imageFile', DonacionController.obtenerComprobante);
api.put('/aprobar-donacion/:idD/:idF/:tipo',md_auth.ensureAuth, DonacionController.aprobarDonacion);
api.put('/negar-donacion/:idD/:idF', md_auth.ensureAuth,DonacionController.negarDonacion);
api.post('/filtro-donacion/:id/:page?',DonacionController.filtroDonaciones);

module.exports = api;