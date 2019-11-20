'use strict'
var express = require('express');
var NotificacionController = require('../controllers/notificacion');
var api = express.Router();
var md_auth = require('../middlewares/autenticar');


api.get('/probandoNotificacion', NotificacionController.probandoNotificacion);
api.post('/nueva-notificacion/:tipo', NotificacionController.nuevaNotificacion);

api.get('/obtener-notificaciones/:page?/:tipo',  md_auth.ensureAuth, NotificacionController.obtenerNotificaciones);
api.get('/obtener-todas-notificaciones/:page?',  md_auth.ensureAuth, NotificacionController.obtenerTodasNotificaciones);
api.get('/obtener-todas-notificacionesAD/:page?',  md_auth.ensureAuth, NotificacionController.obtenerTodasNotificacionesAdmin);
api.get('/obtener-notificacionesMB/:id/:tipo/:page?',  /*md_auth.ensureAuth,*/ NotificacionController.obtenerNotificacionesMB);

module.exports = api;