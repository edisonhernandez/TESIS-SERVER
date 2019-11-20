'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var Usuario = require('../models/usuario');
var Mascota = require('../models/mascota');
var Historia = require('../models/historia');

var Codigo = require('../models/codigo');
var Notificacion = require('../models/notificacion');
var jwt = require('../services/jwt');
var PortadaFundacion = require('../models/portadasFundacion');
const configMensaje = require('../mail');
function home (req, res){
    res.status(200).send({
        message:'Hola mundo'
    });
}

function puebaerrorion (req, res){
    var params = req.body;
    console.log(params)
    res.status(200).send({
        message:'Acccion de pruebas'
    });
   
}
function pruebas (req, res){
    res.status(200).send({
        message:'Acccion de pruebas'
    });
}

//registrar administradores
function nuevoAdministrador(req,res){
    var params = req.body;
    var usuario = new Usuario();

    if(params.cedula && params.nombres && params.apellidos && 
        params.fechaNacimiento && params.correo && params.password &&
        params.direccion){
            delete usuario.historias;
            usuario.cedula = params.cedula;
            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;
            usuario.fechaNacimiento = params.fechaNacimiento;
            usuario.correo = params.correo;
            usuario.direccion = params.direccion;
            usuario.telefono = params.telefono;
            usuario.celular = params.celular;
            usuario.rol = '1'; //1=Administrador
            usuario.foto = null;
            usuario.creadoEn = moment().unix();

            //Verificar si existe un usuario
            Usuario.find({$or:[
                {correo:usuario.correo},
                {cedula: usuario.cedula}
                
                ]}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(200).send({message:'El usuario ya existe'});
                    }else{
                          //si el usuario no existe
                            //cifrar password y guardar usuario
                            bcrypt.hash(params.password, null,null,(err,hash)=>{
                                usuario.password = hash;
                                usuario.save((err,usuarioStored)=>{
                                    if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                                    if(usuarioStored){
                                        res.status(200).send({usuario:usuarioStored});
                                    }else{
                                        res.status(404).send({message:'No se a podido registrar el usuario'});
                                    }
                                })

                            });
                    }
                });
            
          

    }else{
        res.status(200).send({
            message:'Llena todos los campos necesarios'
        });
    }
}

//registrar voluntarios
function nuevoVoluntario(req,res){
    var params = req.body;
    var usuario = new Usuario();
    var fech;
    console.log(params)
    if(params.cedula && params.nombres && params.apellidos && 
        params.fechaNacimiento && params.correo && params.password &&
        params.direccion && params.tipoVoluntario && params.disponibilidadTiempo 
        && params.disponibilidadCasa && params.disponibilidadParticipacion){

            
            usuario.cedula = params.cedula;
            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;
            usuario.fechaNacimiento = params.fechaNacimiento;
            usuario.correo = params.correo;
            usuario.direccion = params.direccion;
            usuario.telefono = params.telefono;
            usuario.celular = params.celular;
            usuario.tipoVoluntario = params.tipoVoluntario;
            usuario.disponibilidadTiempo = params.disponibilidadTiempo;
            usuario.disponibilidadCasa = params.disponibilidadCasa;
            usuario.disponibilidadParticipacion = params.disponibilidadParticipacion;
            usuario.rol = '2'; //2=Voluntario
            usuario.foto = null;
            usuario.creadoEn = moment().unix();
            usuario.pfundacion = req.usuario.sub;
            usuario.estado = 'activo';

            //Verificar si existe un usuario
            Usuario.find({$or:[
                {correo:usuario.correo},
                {cedula: usuario.cedula}
                
                ]}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(200).send({message:'El usuario ya existe'});
                    }else{
                          //si el usuario no existe
                            //cifrar password y guardar usuario
                            bcrypt.hash(params.password, null,null,(err,hash)=>{
                                usuario.password = hash;
                                usuario.save((err,usuarioStored)=>{
                                    if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                                    if(usuarioStored){
                                        res.status(200).send({usuario:usuarioStored});
                                    }else{
                                        res.status(404).send({message:'No se a podido registrar el usuario'});
                                    }
                                })

                            });
                    }
                });
            
          

    }else{
        res.status(200).send({
            message:'Llena todos los campos necesarios'
        });
    }
}

//registrar adoptante
function nuevoAdoptante(req,res){
    console.log("entrom")
    var params = req.body;
    var usuario = new Usuario();
    usuario.foto = req.file.filename;
    console.log(params)
    if( params.nombres && params.apellidos && params.correo && params.password ){
           
            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;
            usuario.fechaNacimiento = params.edad;
            usuario.correo = params.correo;
          
            usuario.rol = "3"; //3=Adoptante
            usuario.estado = "activo";
            //usuario.foto = null;
            usuario.creadoEn = moment().unix();

            //Verificar si existe un usuario
            Usuario.find( {correo:usuario.correo}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(200).send({n:'2',message:'El usuario ya existe'});
                    }else{
                          //si el usuario no existe
                            //cifrar password y guardar usuario
                            bcrypt.hash(params.password, null,null,(err,hash)=>{
                                usuario.password = hash;
                                usuario.save((err,usuarioStored)=>{
                                    if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                                    if(usuarioStored){
                                        res.status(200).send({n:'1',usuario:usuarioStored});
                                    }else{
                                        res.status(404).send({message:'No se a podido registrar el usuario'});
                                    }
                                })
                            });
                    }
                });
    }else{
        res.status(200).send({
            message:'Llena todos los campos necesarios'
        });
    }
}

//registrar adoptante facebook
function nuevoAdoptanteFB(req,res){
    console.log("entroFb")
    var params = req.body;
    var usuario = new Usuario();
    console.log(params)
    if( params.nombres && params.apellidos && params.correo && params.password ){
           
            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;
            usuario.fechaNacimiento = params.edad;
            usuario.correo = params.correo;
          
            usuario.rol = "3"; //3=Adoptante
            usuario.estado = "activo";
            usuario.foto = params.foto;
            usuario.creadoEn = moment().unix();

            //Verificar si existe un usuario
            Usuario.find( {correo:usuario.correo}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(404).send({n:'2',message:'El usuario ya existe'});
                    }else{
                        usuario.save((err,usuarioStored)=>{
                            if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                            if(usuarioStored){
                                res.status(200).send({n:'1',usuario:usuarioStored});
                            }else{
                                res.status(404).send({message:'No se a podido registrar el usuario'});
                            }
                        })
                          
                    }
                });
    }else{
        res.status(404).send({
            message:'Llena todos los campos necesarios'
        });
    }
}
/*function nuevoAdoptante(req,res){
    console.log("entro")
    var params = req.body;
    var tt = req.file;
    console.log(params)
    console.log(tt)
}*/

//registrar adoptante
function nuevoAdoptante2(req,res){
    console.log("entro")
    var params = req.body;
    var usuario = new Usuario();
    usuario.nombres = params.nombres;
    usuario.foto = req.file.filename;
    

    usuario.save((err,usuarioStored)=>{
        if(err) return res.status(500).send({message:'Error al guardar el usuario'});
        if(usuarioStored){
            res.status(200).send({n:'1',usuario:usuarioStored});
        }else{
            res.status(404).send({message:'No se a podido registrar el usuario'});
        }
    })

}
function validarUsuarioA(req,res){
    var params = req.body;

    Usuario.findOne({correo:params.correo}).exec((err,usuario)=>{
        if(err) return res.status(500).send({message:'Error en la validación'});
        if(!usuario) return res.status(200).send({n:'1'});
        return res.status(200).send({n:'2',usuario,message:'Correo electrónico ya registrado'});

    })
}
//validar si existe usuario fundacion
function validarUsuarioF(req,res){
    var params = req.body;
    var to;
    Usuario.findOne({correo:params.correoFundacion}).exec((err,usuario)=>{
        if(err) return res.status(500).send({n:'8',message:'Error en la validación'});
        if(!usuario){
            console.log("entro")
            Usuario.findOne({nombreFundacion:params.nombreFundacion}).exec((err,usuario2)=>{
                if(err) return res.status(500).send({n:'7',message:'Error en la validación'});
                if(!usuario2) return res.status(200).send({n:'6'});
                return res.status(200).send({n:'5',usuario,message:'El nombre ya está en uso'});
        })
        }

        if(usuario){
            validarNom(res,params.nombreFundacion)
        }

    })
}
//validar si existe usuario voluntario
function validarUsuarioV(req,res){
    var params = req.body;
    var to;
    Usuario.findOne({correo:params.correo}).exec((err,usuario)=>{
        if(err) return res.status(500).send({n:'8',message:'Error en la validación'});
        if(!usuario){
            console.log("entro")
            Usuario.findOne({cedula:params.cedula}).exec((err,usuario2)=>{
                if(err) return res.status(500).send({n:'7',message:'Error en la validación'});
                if(!usuario2) return res.status(200).send({n:'6'});
                return res.status(200).send({n:'5',usuario,message:'La cedúla ya está en uso'});
        })
        }

        if(usuario){
            validarCed(res,params.cedula)
        }

    })
}
//validar si existe correo
function validarCorreoExis(req,res){
    var params = req.body;
    var co;
    if(params.correoFundacion){
        co = params.correoFundacion;
    }else{
        co =params.correo
    }
        Usuario.findOne({ $or:[
            {correo:co, estado:'actualizacion'},
            {correo:co, estado:'activo'},
            {correo:co, estado:'desactivo'}

            ]}).exec((err,usuario)=>{
            if(err) return res.status(500).send({n:'3',message:'Error en la validación'});
            if(!usuario) return res.status(200).send({n:'2',message:'No existe'});
            return res.status(200).send({n:'1',message:'Existe'});
        })

}
//validar si existe cedula
function validarCedulaExis(req,res){
    var params = req.body;
    var ce = params.cedula
        Usuario.findOne({cedula:ce, estado:'activo'}).exec((err,usuario)=>{
            if(err) return res.status(500).send({n:'3',message:'Error en la validación'});
            if(!usuario) return res.status(200).send({n:'2',message:'No existe'});
            return res.status(200).send({n:'1',message:'Existe'});
        })

}
//validar si existe usuario fundacion
function validarNombreExis(req,res){
    var params = req.body;
        Usuario.findOne({$or:[{nombreFundacion:params.nombreFundacion, estado:'actualizacion'},
        {nombreFundacion:params.nombreFundacion, estado:'activo'},
        {nombreFundacion:params.nombreFundacion, estado:'desactivo'}]}).exec((err,usuario)=>{
            if(err) return res.status(500).send({n:'3',message:'Error en la validación'});
            if(!usuario) return res.status(200).send({n:'2',message:'No existe'});
            return res.status(200).send({n:'1',message:'Existe'});
        })

}

async function validarNom(res,nn){
    const h = await Usuario.findOne({nombreFundacion:nn}).exec((err,usuario3)=>{
        if(err) return res.status(500).send({n:'4',message:'Error en la validación'});
        if(!usuario3) return res.status(200).send({n:'3'});
        return res.status(200).send({n:'2',message:'El nombre ya está en uso'});
})
console.log(h)
}
async function validarCed(res,nn){
    const h = await Usuario.findOne({cedula:nn}).exec((err,usuario3)=>{
        if(err) return res.status(500).send({n:'4',message:'Error en la validación'});
        if(!usuario3) return res.status(200).send({n:'3'});
        return res.status(200).send({n:'2',message:'La cédula ya está en uso'});
})
console.log(h)
}
//registrar adoptante con facebook
function nuevoAdoptanteF(req,res){
    var params = req.body;
    var usuario = new Usuario();

    if( params.nombres && params.apellidos && params.correo ){
            usuario.cedula = null;
            usuario.nombres = params.nombres;
            usuario.apellidos = params.apellidos;
            usuario.fechaNacimiento = null;
            usuario.correo = params.correo;
            usuario.direccion = null;
            usuario.telefono = params.telefono;
            usuario.celular = params.celular;
            usuario.rol = "3"; //3=Adoptante
            usuario.estado = "activo";
            //usuario.foto = null;

            //Verificar si existe un usuario
            Usuario.find( {correo:usuario.correo}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(200).send({message:'El usuario ya existe2'});
                    }else{
                          //si el usuario no existe

                                usuario.save((err,usuarioStored)=>{
                                    if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                                    if(usuarioStored){
                                        res.status(200).send({usuario:usuarioStored});
                                    }else{
                                        res.status(404).send({message:'No se a podido registrar el usuario'});
                                    }
                                })
                            
                    }
                });
    }else{
        res.status(200).send({
            message:'Llena todos los campos necesarios'
        });
    }
}

//registrar fundacion
function nuevoFundacion(req,res){
   
    var params = req.body;
    var type = req.params.type;
    var usuario = new Usuario();
    
    if( params.nombreFundacion && params.fechaFundacion && params.correoFundacion &&
       /* params.direccionFundacion */ params.telefonoFundacion){
          
            usuario.nombreFundacion = params.nombreFundacion;
           
            usuario.fechaFundacion = params.fechaFundacion;
            usuario.correo = params.correoFundacion;
            usuario.calleP = params.calleP;
            usuario.calleS = params.calleS;
            usuario.celular = params.celular;
            usuario.representante = params.representante;
            usuario.sector = params.sector;
            usuario.barrio = params.barrio;

            usuario.telefono = params.telefonoFundacion;
            //usuario.celular = params.celularFundacion;
            usuario.rol = '4'; //4=Fundacion
           
            //usuario.logo = null;
            usuario.link = params.link;
            usuario.creadoEn = moment().unix();
            //Verificar si existe un usuario
            Usuario.find({$or:[
                {correo:usuario.correo},
                {nombreFundacion: usuario.nombreFundacion}
                
                ]}).exec((err,usuarios)=>{
                    if(err) return res.status(500).send({
                        n:'5',
                        message:'Error al comprobar datos de usuario'});
                    if(usuarios && usuarios.length >= 1 ){
                        return res.status(200).send({
                            n:'4',
                            message:'El nombre o correo electrónico ya están en uso'});
                    }else{
                          //si el usuario no existe
                            //cifrar password y guardar usuario

                            if(type == 'admin'){
                                usuario.estado = "actualizacion";
                                
                                bcrypt.hash(params.passwordTemp , null,null,(err,hash)=>{
                                    usuario.passwordTemp  = hash;
                                    usuario.save((err,usuarioStored)=>{
                                        if(err) return res.status(500).send({n:'3',message:'Error en la petición de registro'});
                                        if(!usuarioStored) return res.status(404).send({n:'2',message:'No se pudo registrar la fundación'});
                                        return res.status(200).send({n:'1',message:'Registro exitoso',usuario:usuarioStored});
                                      
                                    })
                                });
                            }else if(type == 'fund'){
                                usuario.estado = "desactivo";
                                bcrypt.hash(params.passwordFundacion, null,null,(err,hash)=>{

                                    usuario.password = hash;
                                    usuario.save((err,usuarioStored)=>{
                                        if(err) return res.status(500).send({n:'3',message:'Error en la petición de registro'});
                                        if(!usuarioStored) return res.status(404).send({n:'2',message:'No se pudo registrar la fundación'});
                                        //enviarEmail()
                                        return res.status(200).send({n:'1',message:'Registro exitoso',usuario:usuarioStored});
                                      
                                    })
                                });
                            }
                            
                          
                    }
                });
    }else{
        res.status(200).send({ n:'6',
            message:'Llena todos los campos necesarios'
        });
    }
}
async function actualizarFundacion(req,res){
    var params = req.body
    var nm = params.nombreFundacion
    const valName = await Usuario.findOne({nombreFundacion:nm});
    console.log(valName)
}
//loguear usuario y generar token
function loginUsuario(req,res){
    var params = req.body;

    var correo = params.correo;
    
   
    Usuario.findOne({correo:correo}, (err, usuario)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion'});
        if(usuario){

            
            if(params.password && usuario.password){
                var password2 = params.password;
                
                bcrypt.compare(password2, usuario.password, (err, check)=>{
                    if(check){
                        //devolver datos del usuario
                        if(params.gettoken){  
                            //generar y devolver  token
                                return res.status(200).send({n:'4',
                                    token:jwt.createToken(usuario)
                                });   
                        }else{
                             //devolver datos del usuario
                             if( usuario.estado != "desactivo" &&  usuario.estado != "eliminado"){
                                usuario.password = undefined;
                                return res.status(200).send({n:'3',usuario});
                             }else{
                                return res.status(200).send({n:'2',message:'El correo o contraseña con incorrectos'});
                             }
                        }         
                    }else{
                        return res.status(404).send({n:'1',message:'El correo o contraseña con incorrectos'});
    
                    }
                });
            }else {
                var passwordTemp = params.password;
                
                bcrypt.compare(passwordTemp, usuario.passwordTemp, (err, check)=>{
                    if(check){
                        //devolver datos del usuario
                        if(params.gettoken){  
                            //generar y devolver  token
                                return res.status(200).send({n:'4',
                                    token:jwt.createToken(usuario)
                                });   
                        }else{
                             //devolver datos del usuario
                             if( usuario.estado != "desactivo" &&  usuario.estado != "eliminado"){
                                usuario.password = undefined;
                                return res.status(200).send({n:'3',usuario});
                             }else{
                                return res.status(200).send({n:'2',message:'El correo o contraseña con incorrectos'});
                             }
                        }         
                    }else{
                        return res.status(404).send({n:'1',message:'El correo o contraseña con incorrectos'});
    
                    }
                });
            }


            
            
        }else{
            return res.status(404).send({n:'0',message:'No se puedo identificar el usuario'});

        }
       
    });

}
//loguear usuario y generar token
function loginUsuarioMobile(req,res){
    var params = req.body;

    var correo = params.correo;
    
   
    Usuario.findOne({correo:correo}, (err, usuario)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion'});
        if(usuario){

           
            if(params.password && usuario.password && (usuario.rol == '2' || usuario.rol == '3')){
                var password2 = params.password;
                //console.log("entroVRIFI: "+password2)
                bcrypt.compare(password2, usuario.password, (err, check)=>{
                    if(check){
                        //devolver datos del usuario
                        if(params.gettoken){  
                            //generar y devolver  token
                                return res.status(200).send({n:'4',usuario,
                                    token:jwt.createToken(usuario)
                                });   
                        }else{
                             //devolver datos del usuario
                             if( usuario.estado == "activo"){
                                usuario.password = undefined;
                                return res.status(200).send({n:'3',usuario});
                             }else{
                                return res.status(200).send({n:'2',message:'El correo o contraseña son incorrectos'});
                             }
                        }         
                    }else{
                        return res.status(404).send({n:'1',message:'El correo o contraseña son incorrectos'});
    
                    }
                });
            }else{
                return res.status(404).send({n:'1',message:'El correo o contraseña son incorrectos'});
            }



            
            
        }else{
            return res.status(404).send({n:'0',message:'No se puedo identificar el usuario'});

        }
       
    });

}

//loguear usuario y generar token
function loginUsuarioMobileFB(req,res){
    var params = req.body;
    //console.log("entro")
    var correo = params.correo;
   // console.log(params)
   
    Usuario.findOne({correo:correo}, (err, usuario)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion'});
        if(usuario){
           // console.log("existe")
            if(usuario.rol == '2' || usuario.rol == '3'){
               // console.log("entroROL")
            //devolver datos del usuario
            if(params.gettoken){  
               // console.log("entroToken")

                //generar y devolver  token
                    return res.status(200).send({n:'4',usuario,
                        token:jwt.createToken(usuario)
                    });   
            }else{
               
                 //devolver datos del usuario
                 if( usuario.estado == "activo"){
                   
                    usuario.password = undefined;
                    return res.status(200).send({n:'3',usuario});
                 }else{
                   
                    return res.status(200).send({n:'2',message:'El correo o contraseña son incorrectos'});
                 }
            } 
            
        }else{
            
            return res.status(404).send({n:'1',message:'El correo o contraseña son incorrectos'});
        }
        }else{
           
            return res.status(200).send({n:'0',message:'El correo o contraseña son incorrectos'});

        }
       
    });

}

//obtener ciudadanos por apellidos
function usuarioByApellidos(req,res){
    var apellidos = req.params.apellidos;
    var sl = '/';
   Usuario.find({apellidos:{$regex:apellidos}}).exec((err,usuarios)=>{
       // console.log(/`params.nombre`/);
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
        if(!usuarios) return res.status(404).send({n:'2',message:'No existe el producto'});
        return res.status(200).send({
            n:'1',
            usuarios
           
            });

    });
}
//obtener fundaciones por nombre
function fundacionesByNombre(req,res){
    var nombre = req.params.nombre;
    var sl = '/';
   Usuario.find({nombreFundacion:{$regex:nombre}, rol:'4',estado:'activo'}).exec((err,usuarios)=>{
       // console.log(/`params.nombre`/);
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
        if(usuarios.length == 0) return res.status(404).send({n:'2',message:'No existe fundaciones'});
        return res.status(200).send({
            n:'1',
            usuarios
           
            });

    });
}
//obtener voluntarios por apellido o nombre
function voluntariosByApellidos(req,res){
    var apellidos = req.params.apellidos;
    var idF = req.params.id;
    var sl = '/';
   Usuario.find({apellidos:{$regex:apellidos}, rol:'2',estado:'activo',pfundacion:idF}).exec((err,usuarios)=>{
       // console.log(/`params.nombre`/);
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
        if(usuarios.length == 0) return res.status(404).send({n:'2',message:'No existe voluntarios'});
        return res.status(200).send({
            n:'1',
            usuarios
           
            });

    });
}


//devolver datos de un usuario
function obtenerUsuario(req,res){
    var usuarioId = req.params.id;

    Usuario.findById(usuarioId,(err,usuario)=>{
        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
        
        if(!usuario) return res.status(404).send({n:'2',message:'El usuario no existe'});

        return res.status(200).send({n:'1',usuario});
    })
}


function filtroFundaciones(req,res){


    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;
    var params = req.body;

    console.log(params)
    var s;
    params.forEach(p=> {
      
        if(p.tipo == 'sec'){
            s = p.option
        }
        
    });
    if(s != undefined){
        Usuario.find({rol:'4',sector:s,estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, fundaciones,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(fundaciones.length == 0) return res.status(404).send({n:'2',message:'no se encontro fundaciones'});
            return res.status(200).send({
               n:'1',
               fundaciones,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

  
    console.log(s)
  
}
//listado de fundaciones no aprobadas
function obtenerFundacionesNoAprobadas(req,res){
   // var identity_usuario_id  = req.usuario.sub;
    var page = 1;
    
    //var rol = req.params.rol;
    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 5;

    Usuario.find({'_id':req.usuario.sub,'rol':'1'}).exec((err,admin)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion de comprobar permisos'});
        if(admin.length == 0) return res.status(404).send({admin,n:'4',message:'No tienes permiso para ver las cuentas por aprobar.'});

        if(admin.length > 0){
            Usuario.find({estado:'desactivo',rol:'4'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, fundacionesNA,total)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener las fundaciones no aprobadas.'});
        
                if(fundacionesNA.length == 0) return res.status(404).send({n:'2',message:'No existe fundaciones por aprobar'});
        
                return res.status(200).send({
                    admin,
                    n:'1',
                    fundacionesNA,
                    total,
                    pages:Math.ceil(total/itemsPerPage)
                });
            });
 
        }
    })

    
   

}

//obtener fundacion no aprobada
function obtenerFundacionNoAprobada(req,res){
    var fundacionId = req.params.id;
    Usuario.find({'_id':req.usuario.sub,'rol':'1'}).exec((err,admin)=>{
        if(err) return res.status(500).send({n:'6',message:'Error en la peticion de permisos'});
        if(admin.length == 0) return res.status(404).send({n:'5',message:'No tienes permiso para ver las cuentas por aprobar.', admin});

        if(admin.length > 0){
            Usuario.findOne({'_id':fundacionId},(err,fundacion)=>{
                if(err) return res.status(500).send({
                    n:'4',
                    message:'Error en la petición de búsqueda'});
                
                if(!fundacion) return res.status(404).send({
                    n:'3',
                    message:'La fundación no existe'});
                if(fundacion.estado == 'actualizacion') return res.status(200).send({
                    n:'2',
                    message:'La cuenta de esta fundación ya esta activa'});
        
                return res.status(200).send({
                    n:'1',fundacion});
                  
          
            })
 
        }
    })
    
}


//listado de usuarios segun el rol estado activo//fundacion 4, 
function obtenerUsuariosRol(req,res){
   // var identity_usuario_id  = req.usuario.sub;
    var page = 1;
    var rol = req.params.rol;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;
    Usuario.find({rol:rol, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, usuarios,total)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});

        if(usuarios && usuarios.length > 0) {
            return res.status(200).send({
                n:'1',
                usuarios,
                total,
                pages:Math.ceil(total/itemsPerPage)
            });
           
        }else{
            return res.status(404).send({n:'2',message:'No existen usuarios'});
        }
     
    });

}

//listado de usuarios por rol sin paginar 
function obtenerUsuariosRolSP(req,res){
    var rolF  = req.params.rol;
    Usuario.find({rol:rolF}).sort('_id').exec((err, usuarios)=>{
        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});

        if(usuarios.length == 0) return res.status(404).send({n:'2',message:'No existe usuarios'});

        return res.status(200).send({
            n:'1',
            usuarios
           
        });
    })
    /*var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    Usuario.find().sort('_id').paginate(page,itemsPerPage,(err, usuarios,total)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});

        if(!usuarios) return res.status(404).send({message:'No existe usuarios'});

        return res.status(200).send({
            usuarios,
            total,
            pages:Math.ceil(total/itemsPerPage)
        });
    });*/
}
function obtenerVoluntarios(req,res){
    var identity_usuario_id  = req.usuario.sub;
     var page = 1;
     var rol = req.params.rol;
     if(req.params.page){
         page = req.params.page;
     }
 
     var itemsPerPage = 4;
     Usuario.find({rol:rol, pfundacion:identity_usuario_id,estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, usuarios,total)=>{
         if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
 
         if(usuarios.length == 0) return res.status(404).send({n:'2',message:'No existen usuarios'});
 
         return res.status(200).send({
             n:'1',
             usuarios,
             total,
             pages:Math.ceil(total/itemsPerPage)
         });
     });
 
 }
 //obtener voluntarios no paginados
 function obtenerVoluntariosNP(req,res){
    var identity_usuario_id  = req.usuario.sub;
    
     var rol = req.params.rol;

  
     Usuario.find({rol:rol, estado:'activo', pfundacion:identity_usuario_id}).sort({creadoEn:-1}).exec((err, usuarios,total)=>{
         if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
 
         if(!usuarios) return res.status(404).send({n:'2',message:'No existen usuarios'});
 
         return res.status(200).send({
             n:'1',
             usuarios,
             total
         });
     });
 
 }
//actualizar usuarios
function actualizarUsuario(req,res){
    var usuarioId = req.params.id;
    var update = req.body;
    //borrar el password
    delete update.password;
    console.log(update)
    console.log("entro")

if(update.rol == "4"){
    update.direccion = update.direccionFundacion
    update.telefono = update.telefonoFundacion
    update.correo = update.correoFundacion
}
    Usuario.findByIdAndUpdate(usuarioId,update,{new:true},(err,usuarioActualizado)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send({n:'2',message:'No se ha podido actualizar el usuario'});
        return res.status(200).send({n:'1',usuario:usuarioActualizado});
    })
}
function desactivarActivarUsuario(req,res){
    var usuarioId = req.params.id;
    var estad = req.params.est;
    var update = req.body;
    //borrar el password
    delete update.password;

    Usuario.findByIdAndUpdate(usuarioId,{estado:estad},{new:true},(err,usuarioActualizado)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send({n:'2',message:'No se ha podido actualizar el usuario'});
        return res.status(200).send({n:'1',usuario:usuarioActualizado});
    })
}

//eliminar usuario, cambiando el estado a eliminado
function eliminarVoluntarioEstado(req,res){
    var usuarioId = req.params.id;
    var update = req.body;
    
    if(req.usuario.sub != update.pfundacion){
        return res.status(200).send({n:'4',message:'No tienes permisos.'});
    }
    Usuario.findByIdAndUpdate(usuarioId,{estado:'eliminado'},{new:true},(err,usuarioEliminado)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion.'})
        if(!usuarioEliminado) return res.status(404).send({n:'2',message:'No se pudo eliminar el voluntario.'});
        return res.status(200).send({n:'1',usuario:usuarioEliminado});
    })


}

//eliminar fundacion, cambiando el estado a eliminado
async function eliminarFundacion(req,res){
    var userId = req.params.id;

    try {


        await Mascota.find({responsable:userId}).updateMany({estado:'eliminado'});
        await Usuario.find({pfundacion:userId, rol:'2'}).updateMany({estado:'eliminado'});
        await Usuario.find({_id:userId}).updateOne({estado:'eliminado'});
        res.status(200).send({ n:'1',message:'Fundación eliminada'});
       /* const mascota = await Mascota.findById(mascotaId).deleteOne();
        
        if(mascota.n == 1){
            console.log(mascota)
            res.status(200).send({ n:'1',message:'Mascota eliminada'});
        }else{
            res.status(200).send({ n:'0',message:'La mascota ya no existe en el sistema'});
        }
        */
    } catch (error) {
        return res.send(error);
    }
   

    /*Mascota.find({'responsable':req.usuario.sub,'_id':mascotaId}).remove((err,pbRemove)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})
        
        if(!pbRemove) return res.status(404).send({message:'No se pudo eliminar la mascota'});

        return res.status(200).send({message:'mascota eliminada'});
    })*/
}

//aprobar la cuenta de una fundación
function aprobarCuentaFundacion(req,res){
    var fundacionId = req.params.id;
    var update;
    
    Usuario.find({'_id':req.usuario.sub,'rol':'1'}).exec((err,admin)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion de requisitos'});
        if(admin.length == 0) return res.status(404).send({n:'4',message:'No tienes permiso para aprobar una cuenta.'});

        if(admin.length > 0){
            Usuario.findByIdAndUpdate(fundacionId,{estado:'actualizacion'},{new:true},(err,fundacion)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de búsqueda.'});
                if(!fundacion) return res.status(404).send({n:'2',message:'No se ha podido activar la cuenta.'});
                return res.status(200).send({n:'1',fundacion});
            })
 
        }
    })
    

 
}
//no aprobar la cuenta de una fundación
function desaprobarCuentaFundacion(req,res){
    var fundacionId = req.params.id;
    var solicitudId = req.params.idS;
    
    Usuario.find({'_id':req.usuario.sub,'rol':'1'}).exec((err,admin)=>{
        if(err) return res.status(500).send({n:'7',message:'Error en la peticion de requisitos'});
        if(admin.length == 0) return res.status(404).send({n:'6',message:'No tienes permiso para desaprobar una cuenta.'});

        if(admin.length > 0){
            Notificacion.find({'_id':solicitudId}).remove((err, notRemove)=>{
                if(err) return res.status(500).send({n:'5',message:'Error en la peticion de notificación.'})
                if(!notRemove) return res.status(404).send({n:'4',message:'No se pudo eliminar la notificación.'});
               
               if(notRemove){
                Usuario.find({'_id':fundacionId}).remove((err,pbRemove)=>{
                    if(err) return res.status(500).send({n:'3',message:'Error en la peticion'})
                    
                    if(!pbRemove) return res.status(404).send({n:'2',message:'No se pudo eliminar la fundación.'});
            
                    return res.status(200).send({n:'1',message:'Fundación desaprobada.'});
                })
               } 
            
            })  
        }
    })

}

//registrar una nueva portada - mensajes de portada de fundacion
function registrarPortadaFundacion(req,res){
    var params = req.body;
    var portadaFundacion = new PortadaFundacion();
    var usuarioId = req.params.id;   
    portadaFundacion.mensaje1 = params.mensaje1;     
    portadaFundacion.mensaje2 = params.mensaje2;
    //portadaFundacion.foto =null;
    portadaFundacion.idFundacion = req.usuario.sub;
    portadaFundacion.creadoEn = moment().unix();
    
    if(usuarioId != req.usuario.sub){
        return res.status(200).send({n:'5',message:'No tienes permiso para subir una portada en esta fundación'});
    }

    PortadaFundacion.count({"idFundacion":req.usuario.sub}).exec((err,count)=>{
        if(err) return res.status(500).send({n:'4',message:'Error en la petición de conteo de portadas.'});
        if(count >= 0){
            portadaFundacion.orden = count + 1;
            portadaFundacion.save((err,portadaGuardada)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de guardar la portada.'})
        
                if(!portadaGuardada) return res.status(404).send({n:'2',message:'No se pudo guardar la portada.'});
        
                return res.status(200).send({n:'1',portada:portadaGuardada});
            })
        }
    })


     

}

//subir una foto portada de fundacion
function subirPortadaFundacion(req,res){
    var params = req.body;
    var usuarioId = req.params.id;
    var portadaId = req.params.idp;
    var idMascota = req.params.mid;
    if(usuarioId != req.usuario.sub){
        return removeFiles(res,file_path,'No tienes permiso para subir una portada en esta fundacion','6');

    }
    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

      
        
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            PortadaFundacion.findByIdAndUpdate(portadaId,{foto:file_name},{new:true},(err,portadaGuardada)=>{
                if(err) return res.status(500).send({n:'5',message:'Error en la peticion'})
        
                if(!portadaGuardada) return res.status(404).send({n:'4',message:'No se pudo subir la portada de la fundacion'});
        
                return res.status(200).send({n:'3',portada:portadaGuardada});
            })
        
        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({n:'1',message:'No se han subido archivos'});
    }

}

function borrarPortada(req,res){
    var portadaId = req.params.id;


    
    PortadaFundacion.find({'_id':portadaId}).remove((err,pbRemove)=>{
        if (err) return res.status(500).send({message:'Error al borrar la portada'});
        if(!pbRemove) return res.status(404).send({message:'No se pudo borrar la portada'});
        return res.status(200).send({message:'Portada eliminada'});


    });

}

function borrarUsuario(req,res){
    var usuarioId = req.params.id;


    
    Usuario.find({'_id':usuarioId}).remove((err,pbRemove)=>{
        if (err) return res.status(500).send({message:'Error al borrar el usuario'});
        if(!pbRemove) return res.status(404).send({message:'No se pudo borrar el usuario'});
        return res.status(200).send({message:'Usuario eliminado'});


    });

}
//obtener portadas de fundacion
function obtPortadasFundacion(req,res){
    var fundacionId;
    if(req.params.id){
        fundacionId = req.params.id;
    }

    PortadaFundacion.find({idFundacion:fundacionId}).sort({orden:-1}).exec((err, portadasFundacion)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(!portadasFundacion) return res.status(404).send({message:'no hay fotos'});
        return res.status(200).send({
            
            portadasFundacion
    
        });

    })

}
//subir una foto de usuario
function subirFotoUsuario(req,res){
    var usuarioId = req.params.id;
    

    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
     
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            Usuario.findByIdAndUpdate(usuarioId,{foto:file_name},{new:true},(err,usuarioActualizado)=>{
                if(err) return res.status(500).send({n:'5',message:'error en la peticion'});
                if(!usuarioActualizado) return res.status(404).send({n:'4',message:'no se ha podido actualizar el usuario'});
                return res.status(200).send({n:'3',usuario:usuarioActualizado});
            })
        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({message:'No se han subido archivos',n:'1'});
    }

}

//subir logo de fundacion o socio
function subirLogoUsuario(req,res){
    var usuarioId = req.params.id;
    

    if(req.files){
        var file_path = req.files.logo.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
     
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            Usuario.findByIdAndUpdate(usuarioId,{logo:file_name},{new:true},(err,usuarioActualizado)=>{
                if(err) return res.status(500).send({n:'5',message:'error en la peticion'});
                if(!usuarioActualizado) return res.status(404).send({n:'4',message:'no se ha podido actualizar el usuario'});
                return res.status(200).send({n:'3',usuario:usuarioActualizado});
            })
        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({n:'1',message:'No se han subido archivos'});
    }

}


//subir una foto de usuario ya registrado
function subirFotoUsuarioRegistrado(req,res){
    var usuarioId = req.params.id;
    

    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(usuarioId != req.usuario.sub){s
            return removeFiles(res,file_path,'No tienes permiso para actualizar los datos del usuario');

        }
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            Usuario.findByIdAndUpdate(usuarioId,{foto:file_name},{new:true},(err,usuarioActualizado)=>{
                if(err) return res.status(500).send({message:'error en la peticion'});
                if(!usuarioActualizado) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                return res.status(200).send({usuario:usuarioActualizado});
            })
        }else{
            return removeFiles(res,file_path,'Extension no valida');
        }
    }else{
        return res.status(200).send({message:'No se han subido archivos'});
    }

}
function removeFiles(res,file_path, message,n){
    fs.unlink(file_path, (err)=>{
        if (err){
            console.log(err)
        }
        return res.status(200).send({n,message:message});

        });
}
//eliminar logo fundacion
function eliminarLogo(req,res){

   
    var tipo = req.params.tipo;
    var usuarioId = req.params.id;
 
    if(tipo == 'FV'){
        var imagen_file = req.params.file;
        var path_file = './descargas/usuarios/'+imagen_file;
        
        fs.exists(path_file,(exists)=>{
            if(exists){
                Usuario.findByIdAndUpdate(usuarioId,{foto:null},{new:true},(err,usuarioActualizado)=>{
                    if(err) return res.status(500).send({message:'error en la peticion'});
                    if(!usuarioActualizado) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                    if(usuarioActualizado){
                       
                        
                        removeFiles(res,path_file,'Foto eliminada','1');
            
                    }
            
                })
            }else{
                res.status(200).send({message:'No existe la imagen'})
            }
        })


    }else if(tipo == 'FF'){
        var imagen_file = req.params.file;
        var path_file = './descargas/usuarios/'+imagen_file;
        
        fs.exists(path_file,(exists)=>{
            if(exists){
                Usuario.findByIdAndUpdate(usuarioId,{logo:null},{new:true},(err,usuarioActualizado)=>{
                    if(err) return res.status(500).send({message:'error en la peticion'});
                    if(!usuarioActualizado) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                    if(usuarioActualizado){
                       
                        
                        removeFiles(res,path_file,'Logo eliminado','1');
            
                    }
            
                })
            }else{
                res.status(200).send({message:'No existe la imagen'})
            }
        })

    }else if(tipo == 'FP'){
        var imagen_file = req.params.file;
        var path_file = './descargas/portadasFundacion/'+imagen_file;
        
        fs.exists(path_file,(exists)=>{
            if(exists){

                PortadaFundacion.findByIdAndDelete({'_id':usuarioId}).remove((err,pbRemove)=>{
                    if (err) return res.status(500).send({message:'Error al borrar la portada'});
                    if(!pbRemove) return res.status(404).send({message:'No se pudo borrar la portada'});

                    if(pbRemove){
                        removeFiles(res,path_file,'Portada eliminada','1');
                    }
                  
            
            
                });

            }else{
                res.status(200).send({message:'No existe la imagen'})
            }
        })
    }


}
//retornar la imagen de un usuario
function obtenerImagenUsuario(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/usuarios/'+imagen_file;
    
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}


//retornar la imagen de una mascota
function obtenerPortadaFundacion(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/portadasFundacion/'+imagen_file;
    console.log(path_file);
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}

function enviarEmail(req, res){
        var params = req.body;
        console.log("etro")
        console.log(params)

        if(params.correoFundacion && params.asunto){

            if(params.asunto == 'VRFC'){
                var usuarioId = params.idFundacion;
                var codigo = new Codigo();
                var cod = Math.round(Math.random() * (10000 - 5000) + 5000);
                codigo.correo = params.correoFundacion;
                codigo.codigo = cod;
                codigo.fundacion = params.nombreFundacion;
                //codigo.idfundacion = usuarioId;
                codigo.creadoEn = moment().unix();
                //console.log(codigo)
                var regF = {
                    correo:"",
                    fundacion:"",
                    codigo:"",
                    asunto:""
                }
                regF.correo = params.correoFundacion;
                regF.fundacion = params.nombreFundacion;
                regF.codigo = cod;
                regF.asunto = 'VRFC';

                                    codigo.save((err,codigo)=>{
                                        if(err) return res.status(500).send({n:'4',message:'Error en la petición del código'});
                                        if(codigo){
                                            configMensaje(regF);
                                            return res.status(200).send({n:'3',message:'ok'});

                                        }
                                    })
            }
            if(params.asunto == 'RGFADMIN'){
                var regF = {
                    correo:"", 
                    fundacion:"",
                    contrasenia:"",
                    asunto:""
                }
                regF.correo = params.correoFundacion;
                regF.fundacion = params.nombreFundacion;
                regF.contrasenia = params.contraseniaFundacion;
                regF.asunto = 'RGFADMIN';
                configMensaje(regF);
                res.status(200).send({n:'3'});
            }
            if(params.asunto == 'APROBADMIN'){
                console.log("bien")
                console.log(params)
                var regF = {
                    correo:"", 
                    fundacion:"",
                    msj:"",
                    asunto:""
                }
                regF.msj = params.mensaje;
                regF.correo = params.correoFundacion;
                regF.fundacion = params.nombreFundacion;
                regF.asunto = 'APROBADMIN';
                configMensaje(regF);
                res.status(200).send({n:'3'});
            }
            
                
    
        }else{
            res.status(200).send({n:'1',
                message:'Llena todos los campos necesarios'
            });
        }
    
    
        //var cod = Math.round(Math.random() * (10000 - 5000) + 5000);
    /*configMensaje(req.body);
    res.status(200).send();*/
}


function obtenerUsuarioCorreo(req,res){
    var params = req.body;

    var correo = params.email;

    Usuario.findOne({correo:correo}, (err,usuario)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion de búsqueda.'});
        if(!usuario) return res.status(404).send({n:'2',message:'No existe el usuario'});
        return res.status(200).send({n:'1',usuario:usuario});
    })
}

function enviarEmailCodigoRec(req, res){
    var usuarioId = req.params.id;
    var params = req.body;
    var codigo = new Codigo(); 
    var cod = Math.round(Math.random() * (10000 - 5000) + 5000);
    var form = {
        correo:String,
        codigo:String,
        fundacion:String,
        asunto:String
    }
    if(params.correoFundacion){
            codigo.correo = params.correoFundacion;
            codigo.codigo = cod;
            codigo.fundacion = params.nombreFundacion;
            codigo.idfundacion = usuarioId;
            codigo.creadoEn = moment().unix();
            codigo.tipo = 'recover'

            form.correo = codigo.correo;
            form.codigo = codigo.codigo;
            form.fundacion = codigo.fundacion;
            form.asunto = 'REC'
                                codigo.save((err,codigo)=>{
                                    if(err) return res.status(500).send({n:'4',message:'Error en la petición del código'});
                                    if(codigo){
                                        configMensaje(form);

                                        res.status(200).send({n:'3',codigo});
                                    }else{
                                        res.status(404).send({n:'2',message:'No se a podido registrar codigo'});
                                    }
                                })

    }else{
        res.status(200).send({n:'1',
            message:'Llena todos los campos necesarios'
        });
    }


    //var cod = Math.round(Math.random() * (10000 - 5000) + 5000);
/*configMensaje(req.body);
res.status(200).send();*/
}
function verificarCodigo(req,res){
    var correo = req.params.correo;
    var tipo = req.params.tipo;
    var cod = req.params.cd;
    
    if(tipo == 'newUser'){
        Codigo.findOne({'correo':correo,'codigo':cod},(err, codigoV)=>{
            if(err) return res.status(500).send({n:'5',message:'Error en la petición de verificación'});
            if(!codigoV) {
                return res.status(404).send({n:'4', message:'El código ingresado no es correcto.'})
            }else {
               
                return res.status(200).send({n:'1',codigo:codigoV});

                
            }
        })
    }else if(tipo == 'recover'){

        Codigo.find({'idfundacion':correo,'codigo':cod,'tipo':tipo},(err, codigoV)=>{
            if(err) return res.status(500).send({n:'5',message:'Error en la petición de verificación'});
            if(codigoV.length == 0) {
                return res.status(404).send({n:'4', message:'El código ingresado no es correcto.'})
            }else if(codigoV.length > 0) {
                return res.status(200).send({n:'1',codigoV}); 
            }
        })

    }
   
}

function eliminarCodigo(req,res){
    var idCodigo = req.params.id;

    Codigo.find({'_id':idCodigo}).remove((err,pbRemove)=>{
        if (err) return res.status(500).send({n:'3',message:'Error al borrar el usuario'});
        if(!pbRemove) return res.status(404).send({n:'2',message:'No se pudo borrar el codigo'});
        return res.status(200).send({n:'1',message:'Codigo eliminado'});
        


    });

}

function cambiarPassword(req,res){
    var usuarioId=req.params.id;
    var params = req.body;

    var correo=params.correoFundacion;
    var password;

    bcrypt.hash(params.passwordFundacion, null,null,(err,hash)=>{
        password = hash;
        Usuario.findOneAndUpdate({'_id':usuarioId,'correo':correo},{'password':password,'passwordTemp':null},(err,usuario)=>{
            if (err) return res.status(500).send({n:'3',message:'Error en la petición'});
            if(!usuario) return res.status(404).send({n:'2',message:'No se pudo actualizar la cuenta'});
            return res.status(200).send({n:'1',usuario});
        })
        
    });




}

function nuevaHistoria(req,res){
    var usuarioId=req.params.id;
    var params = req.body;

    var historia = new Historia();
    historia.titulo = params.titulo;
    historia.descripcion = params.descripcion;
    historia.creadoEn = moment().unix();
    historia.pfundacion = usuarioId;
    historia.foto = null;
    historia.save((err,historiaStored)=>{
        if(err) return res.status(500).send({n:'3',message:'Error al guardar el usuario'});
        if(historiaStored){
            res.status(200).send({n:'1',historia:historiaStored});
        }else{
            res.status(404).send({n:'2',message:'No se a podido registrar la historia'});
        }
    })

}

function subirFotoHistoria(req,res){
    var params = req.body;
    var usuarioId = req.params.id;
    var historiaId = req.params.idh;

    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

      
        
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            Historia.findByIdAndUpdate(historiaId,{foto:file_name},{new:true},(err,historiaGuardada)=>{
                if(err) return res.status(500).send({n:'5',message:'Error en la peticion'})
        
                if(!historiaGuardada) return res.status(404).send({n:'4',message:'No se pudo subir la historia de la fundacion'});
        
                return res.status(200).send({n:'3',historia:historiaGuardada});
            })
        
        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({n:'1',message:'No se han subido archivos'});
    }

}

//listado de lhistorias segun id fundacion
function obtenerHistorias(req,res){

    var fundacionId =  req.params.id;


    Historia.find({pfundacion:fundacionId}).sort({creadoEn:-1}).exec((err, historias)=>{
        if(err) return res.status(500).send({n:'3',message:'Error al procesar la solicitud.'});

      
        if(historias && historias.length > 0){
            return res.status(200).send({
                n:'1',
                historias,
               
            });
        }else{
            return res.status(404).send({n:'2',message:'No existe historias registradas'});
        }
     
          
        
 
    });
}
function obtenerFotoHistoria(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/historias/'+imagen_file;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}

function eliminarHistoria(req,res){
    var historiaId = req.params.id;
    var image = req.params.image;

    Historia.findByIdAndDelete(historiaId).remove((err,pbRemove)=>{
        if (err) return res.status(500).send({n:'3',message:'Error al eliminar'});
        if(!pbRemove) return res.status(404).send({n:'2',message:'No se pudo eliminar'});

        if(pbRemove){
            removeFiles(res,image,'Historia eliminada','1')
        }
        
        


    });


}

module.exports = {
    home,
    pruebas,
    nuevoAdministrador,
    nuevoVoluntario,
    nuevoAdoptante,
    nuevoFundacion,
    loginUsuario,
    obtenerUsuario,
    obtenerUsuariosRolSP,
    actualizarUsuario,
    subirFotoUsuario,
    obtenerImagenUsuario,
    subirLogoUsuario,
    obtenerUsuariosRol,
    obtenerFundacionesNoAprobadas,
    obtenerFundacionNoAprobada,
   
    subirPortadaFundacion,
    obtPortadasFundacion,
    obtenerPortadaFundacion,
    registrarPortadaFundacion,
    borrarPortada,
    aprobarCuentaFundacion,
    desaprobarCuentaFundacion,
    enviarEmail,
    borrarUsuario,
    verificarCodigo,
    obtenerVoluntarios,
    obtenerVoluntariosNP,
    desactivarActivarUsuario,
    obtenerUsuarioCorreo,
    enviarEmailCodigoRec,
    eliminarCodigo,
    cambiarPassword,
    usuarioByApellidos,
    eliminarVoluntarioEstado,
    fundacionesByNombre,
    nuevaHistoria,
    subirFotoHistoria,
    obtenerFotoHistoria,
    obtenerHistorias,
    eliminarHistoria,
    eliminarLogo,
    eliminarFundacion,
    loginUsuarioMobile,
    voluntariosByApellidos,
    puebaerrorion,
    loginUsuarioMobileFB,
    validarUsuarioA,
    nuevoAdoptanteFB,
    validarUsuarioF,
    validarCorreoExis,
    validarNombreExis,
    actualizarFundacion,
    validarUsuarioV,
    validarCedulaExis,
    filtroFundaciones
}