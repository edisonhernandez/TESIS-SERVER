'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router(); //para obtener acceso a los metodos GET, PUT, DELETE, POST
var md_auth = require('../middlewares/autenticar');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./descargas/usuarios'});
var md_uploadPortada = multipart({uploadDir:'./descargas/portadasFundacion'});
var md_uploadHistoria = multipart({uploadDir:'./descargas/historias'});
var multer = require('multer');
var mstorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./descargas/usuarios/');
    },
    filename:function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

var mstorage2 = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./imagenes/portadasFundacion/');
    },
    filename:function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
var upload = multer({storage:mstorage});
var upload2 = multer({storage:mstorage2});



api.get('/home',UsuarioController.home);
api.get('/pruebas',md_auth.ensureAuth, UsuarioController.pruebas);
api.post('/registrarAdmin',UsuarioController.nuevoAdministrador);
api.post('/registrarVoluntario',md_auth.ensureAuth,UsuarioController.nuevoVoluntario);
api.post('/registrarAdoptante',[upload.single('foto')],UsuarioController.nuevoAdoptante);
api.post('/registrarAdoptanteFB',UsuarioController.nuevoAdoptanteFB);
api.post('/actualizar-fundacion',UsuarioController.actualizarFundacion);

api.post('/registrarFundacion/:type',[upload.single('logo')],UsuarioController.nuevoFundacion);
api.post('/login',UsuarioController.loginUsuario);
api.post('/login-mobile',UsuarioController.loginUsuarioMobile);
api.post('/login-mobileFB',UsuarioController.loginUsuarioMobileFB);
api.post('/valid-usuario',UsuarioController.validarUsuarioA);
api.post('/validar-usuarioF',UsuarioController.validarUsuarioF);
api.post('/validar-correoF',UsuarioController.validarCorreoExis);
api.post('/validar-cedula',UsuarioController.validarCedulaExis);

api.post('/validar-nombreF',UsuarioController.validarNombreExis);
api.post('/validar-usuarioV',UsuarioController.validarUsuarioV);

api.get('/usuario/:id',UsuarioController.obtenerUsuario);
api.get('/usuariosSP/:rol',md_auth.ensureAuth,UsuarioController.obtenerUsuariosRolSP);
api.put('/actualizar-usuario/:id',md_auth.ensureAuth,UsuarioController.actualizarUsuario);
api.put('/desact-usuario/:id/:est',md_auth.ensureAuth,UsuarioController.desactivarActivarUsuario);

api.post('/subir-foto-usuario/:id',[ md_upload],UsuarioController.subirFotoUsuario);
api.post('/subir-foto-fundacion/:id',[ md_upload],UsuarioController.subirLogoUsuario);
api.post('/subir-portada-fundacion/:id/:idp',[md_auth.ensureAuth, md_uploadPortada],UsuarioController.subirPortadaFundacion);
api.post('/registrar-portada/:id',[upload2.single('foto'),md_auth.ensureAuth],UsuarioController.registrarPortadaFundacion);
api.delete('/borrar-portada/:id',UsuarioController.borrarPortada);
api.delete('/borrar-usuario/:id',UsuarioController.borrarUsuario);

api.put('/aprobar-fundacion/:id',[md_auth.ensureAuth],UsuarioController.aprobarCuentaFundacion);

api.delete('/desaprobar-fundacion/:idS/:id',[md_auth.ensureAuth],UsuarioController.desaprobarCuentaFundacion);

api.get('/obtener-foto/:imageFile',UsuarioController.obtenerImagenUsuario);
api.get('/obtener-usuarios-rol/:rol/:page',UsuarioController.obtenerUsuariosRol);
api.get('/obtener-voluntarios/:rol/:page',md_auth.ensureAuth,UsuarioController.obtenerVoluntarios);
api.get('/obtener-voluntariosNP/:rol',md_auth.ensureAuth,UsuarioController.obtenerVoluntariosNP);

api.get('/obtener-fundaciones-na/:page?',md_auth.ensureAuth,UsuarioController.obtenerFundacionesNoAprobadas);
api.get('/obtener-fundacion-na/:id',md_auth.ensureAuth,UsuarioController.obtenerFundacionNoAprobada);
api.get('/obtener-portadas-fundacion/:id',UsuarioController.obtPortadasFundacion);
api.get('/obtener-portada-fundacion/:imageFile',UsuarioController.obtenerPortadaFundacion);
api.post('/enviar',UsuarioController.enviarEmail);
api.get('/verificar-codigo/:correo/:cd/:tipo',UsuarioController.verificarCodigo);
api.post('/obtener-usuario-em',UsuarioController.obtenerUsuarioCorreo);
api.post('/enviar-codigo-recover/:id',UsuarioController.enviarEmailCodigoRec);
api.delete('/eliminar-codigo/:id',UsuarioController.eliminarCodigo);
api.post('/cambiar-pass/:id',UsuarioController.cambiarPassword);
api.get('/usuarios-byapellidos/:apellidos', md_auth.ensureAuth,UsuarioController.usuarioByApellidos);
api.get('/fundaciones-bynombre/:nombre',UsuarioController.fundacionesByNombre);
api.get('/voluntarios-byapellidos/:apellidos/:id',UsuarioController.voluntariosByApellidos);

api.put('/eliminar-voluntario-estado/:id',[md_auth.ensureAuth],UsuarioController.eliminarVoluntarioEstado);
api.post('/nueva-historia/:id',UsuarioController.nuevaHistoria);
api.post('/subir-foto-historia/:idh',[md_auth.ensureAuth, md_uploadHistoria],UsuarioController.subirFotoHistoria);


api.get('/obtener-foto-historia/:imageFile',UsuarioController.obtenerFotoHistoria);
api.get('/obtener-historias/:id',UsuarioController.obtenerHistorias);
api.delete('/eliminar-historia/:id/:image',UsuarioController.eliminarHistoria);
api.delete('/eliminar-logo/:id/:file/:tipo',UsuarioController.eliminarLogo);
api.delete('/eliminar-fundacion/:id',md_auth.ensureAuth,UsuarioController.eliminarFundacion);
api.post('/errorprueba',UsuarioController.puebaerrorion);
api.post('/filtro-fundaciones/:page?',UsuarioController.filtroFundaciones);

module.exports = api;