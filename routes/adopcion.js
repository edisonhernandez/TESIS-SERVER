'use strict'
var express = require('express');
var AdopcionController = require('../controllers/adopcion');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');

api.get('/probando-adopcion', md_auth.ensureAuth, AdopcionController.probando);
api.post('/nueva-adopcion/:fid/:mid', md_auth.ensureAuth, AdopcionController.nuevaAdopcion);
api.get('/obtener-adopcion/:id', md_auth.ensureAuth, AdopcionController.obtenerAdopcion);
api.get('/obtener-adopciones/:id/:page?', md_auth.ensureAuth, AdopcionController.obtenerAdopciones);
api.put('/aprobar-adopcion/:id/:mid',[md_auth.ensureAuth],AdopcionController.aprobarAdopcion);
api.put('/desaprobar-adopcion/:id/:mid',[md_auth.ensureAuth],AdopcionController.desaprobarAdopcion);
api.get('/comprobar-adopcion/:id/:idm', /*md_auth.ensureAuth,*/ AdopcionController.comprobarAdopcion);
api.post('/filtro-adopcion/:id/:page?',AdopcionController.filtroAdopciones);

module.exports = api;