'use strict'
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Notificacion = require('../models/notificacion');

var Usuario = require('../models/usuario');

function probandoNotificacion(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de notificaciones'
    })
}

//registrar una nueva notificacion
function nuevaNotificacion(req,res){
    var tipo = req.params.tipo;
    var params = req.body;
    
  
    if(tipo == 'f'){
        console.log(params)
        var notificacion = new Notificacion();
        notificacion.tipo = 'nfundacion';
        notificacion.mensaje= 'nueva fundacion';
        notificacion.creadoEn = moment().unix();
        notificacion.de = params.idde;
        notificacion.save((err,notificacionStored)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'})
    
            if(!notificacionStored) return res.status(404).send({message:'No se pudo registrar la notificacion'});
    
            return res.status(200).send({notificacion:notificacionStored});
        })
       
    }else if(tipo == 'e'){

            var notificacion = new Notificacion();
            notificacion.tipo = 'emergencia';
            notificacion.creadoEn = moment().unix();
            notificacion.emergencia = params.emergencia;
            notificacion.de = params.idde;
           
            notificacion.save( (err,notifi)=>{
                        if(err) return res.status(500).send({fud:fundaciones.length,message:'Error en la peticion'})
    
            if(!notifi) return res.status(404).send({message:'No se pudo registrar la notificacion'});
    
            return res.status(200).send({notificacion:notifi});
                    })
        
               
                
               
                
            }else if(tipo == 'a'){
                var notificacion = new Notificacion();
                notificacion.tipo = 'ayuda';
                notificacion.creadoEn = moment().unix();
                notificacion.emergencia = params.emergencia;
                notificacion.fundacion = params.idde;
                notificacion.para = params.para;
                notificacion.save( (err,notifi)=>{
                    if(err) return res.status(500).send({n:'3',message:'Error en la peticion'})

                    if(!notifi) return res.status(404).send({n:'2',message:'No se pudo registrar la notificacion'});

                    return res.status(200).send({n:'1',notificacion:notifi});
                })

            }
          

}


//listado de las notificaciones segun tipo
function obtenerNotificaciones(req,res){
    var page = 1;
    //var userId  = req.params.idus;
    var tip = req.params.tipo;
    var tbus;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

    if(tip == 'fun'){
        tbus = 'nfundacion';
        Notificacion.find({tipo:tbus}).populate('de').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(!notificaciones) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });
    }else if(tip == 'emer'){
        tbus = 'emergencia';
        Notificacion.find({tipo:tbus}).populate('emergencia').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(!notificaciones) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });
    }else if(tip == 'ayu'){
        tbus = 'ayuda';
        Notificacion.find({tipo:tbus,de:req.usuario.sub}).populate('emergencia').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(!notificaciones) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });

    }else if(tip == 'adop'){
        tbus = 'adopcion';
        Notificacion.find({tipo:tbus,fundacion:req.usuario.sub}).populate('de').populate('mascota').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(!notificaciones) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });
    }else if(tip == 'dona'){
        tbus = 'donacion';
        Notificacion.find({tipo:tbus,fundacion:req.usuario.sub}).populate('de').populate('mascota').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(!notificaciones) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });
    }

}

//listado de todas las notificaciones
function obtenerTodasNotificaciones(req,res){
    var page = 1;
    //var userId  = req.params.idus;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

        Notificacion.find({
            
            $or: [{
                tipo:"emergencia"

            }, {
                fundacion:req.usuario.sub,
                tipo:"ayuda"
            }, {
                fundacion:req.usuario.sub,
                tipo:"adopcion"
            }]
            
        
        }).populate('de').populate('fundacion').populate('mascota').populate('emergencia').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(notificaciones.length == 0) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });

        //
}

function obtenerTodasNotificaciones(req,res){
    var page = 1;
    //var userId  = req.params.idus;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

        Notificacion.find({
            
            $or: [{
                tipo:"emergencia"

            }, {
                fundacion:req.usuario.sub,
                tipo:"ayuda"
            }, {
                fundacion:req.usuario.sub,
                tipo:"adopcion"
            }]
            
        
        }).populate('de').populate('fundacion').populate('mascota').populate('emergencia').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(notificaciones.length == 0) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });

        //
}
function obtenerTodasNotificacionesAdmin(req,res){
    var page = 1;
    //var userId  = req.params.idus;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

        Notificacion.find({tipo:"nfundacion"
            
            /*$or: [{
                tipo:"emergencia"

            }, {
                fundacion:req.usuario.sub,
                tipo:"ayuda"
            }, {
                fundacion:req.usuario.sub,
                tipo:"adopcion"
            }]*/
            
        
        }).populate('de').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
            if(err) return res.status(500).send({message:'error en la peticion'});
    
            if(notificaciones.length == 0) return res.status(404).send({message:'No existe notificaciones'});
             
                    return res.status(200).send({
                        notificaciones,
                        
                        total,
                        itemsPerPage,
                        pages:Math.ceil(total/itemsPerPage)
                    });
              
            
     
        });

        //
}


//MOBILE

//obtener notificaciones
function obtenerNotificacionesMB(req,res){
    var page = 1;
    //var userId  = req.params.idus;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 10;
    var tipo = req.params.tipo;
    var id = req.params.id;

    Notificacion.find({
        'de':id
   }).populate('mascota').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, notificaciones,total)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});

        if(notificaciones.length == 0) return res.status(404).send({message:'No existe notificaciones'});
         
                return res.status(200).send({
                    notificaciones,
                    
                    total,
                    itemsPerPage,
                    pages:Math.ceil(total/itemsPerPage)
                });
          
        
 
    });

}
module.exports={
   probandoNotificacion,
   nuevaNotificacion,
   obtenerNotificaciones,
   obtenerTodasNotificaciones,
   obtenerTodasNotificacionesAdmin,
   obtenerNotificacionesMB
}