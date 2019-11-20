'use strict'


var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Adopcion = require('../models/adopcion');
var Usuario = require('../models/usuario');
var Mascota = require('../models/mascota');
var Notificacion = require('../models/notificacion');

function probando(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de adopciones'
    })
}

function nuevaAdopcion(req,res){
    var fundacionId = req.params.fid;
    var mascotaId = req.params.mid;
    var adoptanteId = req.usuario.sub;
    console.log(req)
    var params = req.body;

    //console.log(params)

    if(params.cedula, params.ocupacion, params.nombresRP, params.telefonoRP,
    params.numPersonas, params.familiarEmbarazo, params.familiarAlergico, params.inmueble,params.cerramiento,
    params.numMascotas, params.estadoMascotas, params.deseoAdoptar, params.cambiarDomicilio, params.salirViaje,
    params.tiempoSolo, params.dormirMS, params.comidaMS, params.enfermaMS, params.cargoGastos, params.dineroMensualMS,
 params.visitarDomicilio,params.compartidaFamilia){
        var adopcion = new Adopcion();
        
        adopcion.fundacion = fundacionId;
        adopcion.adoptante = adoptanteId;
        adopcion.mascota = mascotaId;
        
        adopcion.datosAdopcion.cedula = params.cedula;
        adopcion.datosAdopcion.ocupacion = params.ocupacion
        adopcion.datosAdopcion.nombresRP = params.nombresRP;
        adopcion.datosAdopcion.telefonoRP = params.telefonoRP;
        adopcion.datosAdopcion.numPersonas = params.numPersonas;
        adopcion.datosAdopcion.familiarEmbarazo = params.familiarEmbarazo;
        adopcion.datosAdopcion.familiarAlergico = params.familiarAlergico;
        adopcion.datosAdopcion.inmueble = params.inmueble;
        adopcion.datosAdopcion.cerramiento = params.cerramiento;
        adopcion.datosAdopcion.numMascotas = params.numMascotas;
        adopcion.datosAdopcion.estadoMascotas = params.estadoMascotas;
        adopcion.datosAdopcion.deseoAdoptar = params.deseoAdoptar;
        adopcion.datosAdopcion.cambiarDomicilio = params.cambiarDomicilio;
        adopcion.datosAdopcion.salirViaje = params.salirViaje;
        adopcion.datosAdopcion.tiempoSolo = params.tiempoSolo;
        adopcion.datosAdopcion.dormirMS = params.dormirMS;
        //adopcion.datosAdopcion.instruccion = params.instruccion;
        adopcion.datosAdopcion.telefono = params.telefono;
        adopcion.datosAdopcion.celular = params.celular;
        
        adopcion.datosAdopcion.comidaMS = params.comidaMS;
        adopcion.datosAdopcion.enfermaMS = params.enfermaMS;
        adopcion.datosAdopcion.cargoGastos = params.cargoGastos;
        adopcion.datosAdopcion.dineroMensualMS = params.dineroMensualMS;
        //adopcion.datosAdopcion.recursos = params.recursos;
        adopcion.datosAdopcion.visitarDomicilio = params.visitarDomicilio;
        //adopcion.datosAdopcion.esterilizadaMS = params.esterilizadaMS;
        //adopcion.datosAdopcion.beneficiosEsterilizacion = params.beneficiosEsterilizacion;
        //adopcion.datosAdopcion.tenenciaResponsable = params.tenenciaResponsable;
        //adopcion.datosAdopcion.ordenanzaTenencia = params.ordenanzaTenencia;
        adopcion.datosAdopcion.compartidaFamilia = params.compartidaFamilia;
        //adopcion.datosAdopcion.acuerdoFamilia = params.acuerdoFamilia;
        adopcion.creadoEn = moment().unix();
        adopcion.estado = 'pendiente';
        //console.log(adopcion)

        Mascota.findOne({'_id':mascotaId,'estado':'adoptado'},(err,mascota)=>{
            if (err) return res.status(500).send({message:'Error en la petición de comprobar estado de la mascota.'})
            if(mascota){
                return res.status(200).send({message:'La mascota ya fue adoptada.'});
            }else{
                //return res.status(200).send({message:'Puedes adoptar'})
                adopcion.save((err,adopcionStored)=>{
                    console.log(err)
                    if (err) return res.status(500).send({message:'Error en la petición de guardar el formulario de adopción'});
                    if(adopcionStored) {
                        var notificacion = new Notificacion();
                        notificacion.mensaje = 'Nueva solictud para adopción';
                        notificacion.tipo = 'adopcion';
                        notificacion.de = req.usuario.sub;
                        notificacion.fundacion = fundacionId;
                        notificacion.adopcion = adopcionStored._id;
                        notificacion.mascota = mascotaId;
                        notificacion.creadoEn = moment().unix();
                        notificacion.save((err,notiStored)=>{
                            if (err) return res.status(500).send({message:'Error en la petición de guardar la notificación'});
                            if(!notiStored) return res.status(404).send({n:'2',message:'No se pudo registrar la notificación'});
                            return res.status(200).send({n:'1',message:'Registro exitoso',adopcionStored,notiStored});
                        })

                    }else{
                        return res.status(404).send({n:'2',message:'No se pudo registrar la mascota'});
                    }
                    
                    

                   
                })

            }
            
            
            

        })



    }else{
        return res.status(200).send({n:'5',message:'Llena todos los campos necesarios'});
    }
}

function obtenerAdopcion(req,res){
    var adopcionId = req.params.id;

    Adopcion.findById(adopcionId).populate('adoptante').populate('mascota').exec((err, adopcion)=>{
        if (err) return res.status(500).send({n:'3',message:'Error en la petición de búsqueda de la solicitud adopción'});
        if(!adopcion) return res.status(404).send({n:'2',message:'No existe la adopción especificada.'});
        return res.status(200).send({n:'1',adopcion});

    })
}
//listado de adopciones paginadas
function obtenerAdopciones(req,res){
    var fundacionId  = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;
    Adopcion.find({fundacion:fundacionId}).populate('adoptante').populate('mascota').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, adopciones,total)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});

        if(adopciones && adopciones.length > 0) {
            return res.status(200).send({
                n:'1',
                adopciones,
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
            });
            
        }else{
            return res.status(404).send({n:'2',message:'No existe adopciones'});
        }
      
    });
}
//aprobar la solicitud de adopcion
function aprobarAdopcion(req,res){
    var adopcionId = req.params.id;
    var mascotaId = req.params.mid;
    var update = req.body;
    
    var desc = update.descripcion;
    console.log(desc) 
    Adopcion.find({'_id':adopcionId,'estado':'aprobado'}).exec((err,adopcion)=>{
        if(err) return res.status(500).send({n:'9',message:'Error en la peticion de búsqueda.'});
        if(adopcion.length > 0) return res.status(200).send({n:'8',message:'La adopcion ya fue aprobada.'});

        if(adopcion.length == 0){
            Mascota.find({'_id':mascotaId,'estado':'adoptado'}).exec((err,mascotab)=>{
                if(err) return res.status(500).send({n:'7',message:'Error en la peticion de búsqueda de mascota.'});
                if(mascotab.length > 0) return res.status(200).send({n:'6',message:'La mascota ya fue adoptada.'});

                if(mascotab.length == 0){
                    Adopcion.findByIdAndUpdate(adopcionId,{estado:'aprobado',observaciones:desc},{new:true},(err,adopcionA)=>{
                        if(err) return res.status(500).send({n:'5',message:'Error en la petición de aprobar adopción.'});
                        if(!adopcionA) {
                            return res.status(404).send({n:'4',message:'Error al actualizar la solictud de adopción.'});
        
                        }else{
                            Mascota.findByIdAndUpdate(mascotaId,{estado:'adoptado'},{new:true},(err, mascota)=>{
                                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de búsqueda.'});
                                if(!mascota )return res.status(404).send({n:'2',message:'Error al actualizar estado de la mascota.'});
                                return res.status(200).send({n:'1',adopcionA,mascota});
                            })
                        }
  
                    })
                }
            })


 
        }
    })


    

 
} 
//desaprobar solicitud
function desaprobarAdopcion(req,res){
    var adopcionId = req.params.id;
    var mascotaId = req.params.mid;
    var update = req.body;
    
    var desc = update.descripcion;
    console.log(desc)
            Adopcion.findByIdAndUpdate(adopcionId,{estado:'negado',observaciones:desc},{new:true},(err,adopcionA)=>{
                if(err) return res.status(500).send({n:'5',message:'Error en la petición de aprobar adopción.'});
                if(!adopcionA) {
                return res.status(404).send({n:'4',message:'Error al actualizar la solictud de adopción.'});
        
                }else{
                     Mascota.findByIdAndUpdate(mascotaId,{estado:'activo'},{new:true},(err, mascota)=>{
                      if(err) return res.status(500).send({n:'3',message:'Error en la peticion de búsqueda.'});
                       if(!mascota )return res.status(404).send({n:'2',message:'Error al actualizar estado de la mascota.'});
                       return res.status(200).send({n:'1',adopcionA,mascota});
                            })
                        }
  
                    })
      

 



    
    

 
}

//listado de adopciones paginadas
function comprobarAdopcion(req,res){
    var idus  = req.params.id;
    var idms = req.params.idm;
    var page = 1;
    Adopcion.findOne({'adoptante':idus,'mascota':idms}).exec((err, adopcion)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});

        if(!adopcion) return res.status(200).send({n:'2',message:'No existe coincidencias'})
        return res.status(200).send({n:'1',adopcion,message:'Existe'});
      
    });
}
function filtroAdopciones(req,res){

    var id = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;
    var params = req.body;

    console.log(params)
    var t;
    
    params.forEach(p=> {
        if(p.tipo == 'estado'){
            t = p.option
        }

    });
    if(t != undefined ){
        Adopcion.find({estado:t, fundacion:id}).populate('adoptante').populate('mascota').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, adopciones,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(adopciones.length == 0) return res.status(404).send({n:'2',message:'no se encontro adopciones'});
            return res.status(200).send({
               n:'1',
               adopciones,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    

}
module.exports = {
    probando,
    nuevaAdopcion,
    obtenerAdopcion,
    aprobarAdopcion,
    desaprobarAdopcion,
    obtenerAdopciones,
    comprobarAdopcion,
    filtroAdopciones
}