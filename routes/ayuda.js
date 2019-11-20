'use strict'
var express = require('express');
var AyudaController = require('../controllers/ayuda');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');

api.get('/probando-ayuda', md_auth.ensureAuth, AyudaController.probando);
api.post('/nueva-ayuda', md_auth.ensureAuth, AyudaController.nuevaAyuda);
api.put('/aprobar-ayuda/:id', md_auth.ensureAuth, AyudaController.aprobarAyuda);
api.get('/obtener-ayuda/:id',md_auth.ensureAuth,AyudaController.obtenerAyuda);

module.exports = api;