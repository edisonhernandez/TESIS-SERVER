'use strict'
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var Usuario = require('../models/usuario');
var Donacion = require('../models/donacion');
var Notificacion = require('../models/notificacion');

function probando(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de donaciones'
    })
}

//registrar una donacion
function nuevaDonacion(req,res){
    var params = req.body;
  
    var tipo = req.params.tipo;

    //console.log(params)
    if(tipo == 'economica'){
        console.log("entroECON")
        var donacion = new Donacion();
        donacion.tipo = tipo;
        donacion.fundacion = req.usuario.sub;
        donacion.descripcion = params.descripcion;

        if(params.nombres && params.apellidos && params.cedula && params.direccion && params.telefono && params.celular){
            donacion.donante.nombres = params.nombres;
            donacion.donante.apellidos = params.apellidos;
            donacion.donante.cedula = params.cedula;
            donacion.donante.direccion = params.direccion;
            donacion.donante.telefono = params.telefono;
            donacion.donante.celular = params.celular
            
        }else{
            donacion.donanteR = params.donante;
        }

        donacion.cantidad = params.cantidad;

        donacion.estado = 'fundacion';
        donacion.responsable = req.usuario.sub;
        donacion.creadoEn = moment().unix();
        console.log(donacion)
        donacion.save((err,donacionStored)=>{
            if(err) return res.status(500).send({message:'Error en la petición de guardar la donacion'})
    
            if(!donacionStored){
                return res.status(404).send({message:'No se pudo registrar la donación'});
            }else{
                var notificacion = new Notificacion();
            notificacion.mensaje = 'Nueva donación económica';
            notificacion.tipo = 'donacion';
            notificacion.de = req.usuario.sub;
            notificacion.fundacion = req.usuario.sub;
            notificacion.donacion = donacionStored._id;
            notificacion.creadoEn = moment().unix();
            notificacion.save((err,notiStored)=>{
                if (err) return res.status(500).send({message:'Error en la petición de guardar la notificación'});
                if(!notiStored) return res.status(404).send({n:'2',message:'No se pudo registrar la notificación'});
                return res.status(200).send({n:'1',message:'Registro exitoso',donacion:donacionStored});
            })

            }
            
           
    
           
        })

    }else if(tipo == 'producto'){
        console.log("entroProd")
        var donacion = new Donacion();
        donacion.tipo = tipo;

        if(params.nombres && params.apellidos && params.cedula && params.direccion && params.telefono && params.celular){
            donacion.donante.nombres = params.nombres;
            donacion.donante.apellidos = params.apellidos;
            donacion.donante.cedula = params.cedula;
            donacion.donante.direccion = params.direccion;
            donacion.donante.telefono = params.telefono;
            donacion.donante.celular = params.celular
            
        }else{
            donacion.donanteR = params.donante;
        }
        donacion.nombreProducto = params.nombreProducto;
        donacion.fundacion = req.usuario.sub;
        donacion.descripcion = params.descripcion;
        donacion.estado = 'fundacion';

        //donacion.voluntarios = params.voluntarios;
        
        donacion.creadoEn = moment().unix();
        console.log(donacion)
        donacion.save((err,donacionStored)=>{
            console.log(err)
            if(err) return res.status(500).send({message:'Error en la peticion de guardar la donacion'})
    
            if(!donacionStored){
                return res.status(404).send({message:'No se pudo registrar la donacion'});

            }else{
                var notificacion = new Notificacion();
            notificacion.mensaje = 'Nueva donación en producto';
            notificacion.tipo = 'donacion';
            notificacion.de = req.usuario.sub;
            notificacion.fundacion = req.usuario.sub;
            notificacion.donacion = donacionStored._id;
            notificacion.creadoEn = moment().unix();
            notificacion.save((err,notiStored)=>{
                if (err) return res.status(500).send({message:'Error en la petición de guardar la notificación'});
                if(!notiStored) return res.status(404).send({n:'2',message:'No se pudo registrar la notificación'});
                return res.status(200).send({n:'1',message:'Registro exitoso',donacion:donacionStored});
            })
            }
            
    
            
        })
    }

}

//obtener datos de una donacion
function obtenerDonacion(req,res){
    var donacionId = req.params.id;

    Donacion.findById(donacionId).populate('donanteR').exec((err,donacion)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        
        if(!donacion) return res.status(404).send({message:'La donacion no existe'});

        return res.status(200).send({donacion});       
    })
}
//obtener datos de una donacion
function obtenerDonacion2(req,res){
    var donacionId = req.params.id;

    Donacion.findById(donacionId).populate('donanteR').exec((err,donacion)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        
        if(!donacion) return res.status(404).send({message:'La donacion no existe'});

        return res.status(200).send({donacion});       
    })
}
//listado de las donaciones
function obtenerDonaciones(req,res){
    var idFun = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Donacion.find({fundacion:idFun}).populate('donanteR').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, donaciones,total)=>{
        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});

       
        if(donaciones.length == 0) return res.status(404).send({n:'2',message:'No existe donaciones'});

        return res.status(200).send({
            n:'1',
                    donaciones,
                    total,
                    pages:Math.ceil(total/itemsPerPage)
                });

 
    });
}

//subir una foto del comprobante
function subirComprobante(req,res){

    var donacionId = req.params.did;
    

    if(req.files){
        var file_path = req.files.comprobante.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
            Donacion.findByIdAndUpdate(donacionId,{comprobante:file_name},{new:true},(err,donacionActualizado)=>{
                if(err) return res.status(500).send({message:'error en la peticion'});
                if(!donacionActualizado) return res.status(404).send({message:'no se ha podido actualizar el usuario'});
                return res.status(200).send({n:'1',donacion:donacionActualizado});
            })
        }else{
            return removeFiles(res,file_path,'Extension no valida');
        }
    }else{
        return res.status(200).send({message:'No se han subido archivos'});
    }

}

function removeFiles(res,file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message:message});

        });
}

//retornar la imagen del comprobante
function obtenerComprobante(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/donaciones/'+imagen_file;
    console.log(path_file);
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}

//aprobar la donacion
function aprobarDonacion(req,res){
    var params = req.body;
    var voluntarios = params.voluntarios;
    
    var donacionId =  req.params.idD;
    var fundacionId = req.params.idF;
    var tipo = req.params.tipo;
    
   
    if(tipo  == 'producto'){
        if(fundacionId != req.usuario.sub){
            return res.status(200).send({n:'4',message:'No tienes permiso para aprobar la donación.'});
        }
        Donacion.findByIdAndUpdate(donacionId,{voluntarios:voluntarios,estado:'aprobado'},{new:true},(err,donacion)=>{
            if(err) return res.status(500).send({n:'3',message:'Error en la petición de búsqueda.'});
            if(!donacion) return res.status(404).send({n:'2',message:'No se pudo aprobar la donación'});
            return res.status(200).send({n:'1',donacion});
       })
    }

    if(tipo  == 'economica'){
        if(fundacionId != req.usuario.sub){
           
            return res.status(200).send({n:'3',message:'No tienes permiso para aprobar la donación.'});
        }
        Donacion.findByIdAndUpdate(donacionId,{estado:'aprobado'},{new:true},(err,donacion)=>{
            if(err) return res.status(500).send({n:'3',message:'Error en la petición de búsqueda.'});
            if(!donacion) return res.status(404).send({n:'2',message:'No se pudo aprobar la donación'});
            return res.status(200).send({n:'1',donacion});
       })
    }


 


    

 
}
//negar la donacion
function negarDonacion(req,res){
    var fundacionId = req.params.idF;
    var donacionId = req.params.idD;
    
    if(fundacionId != req.usuario.sub){
        return res.status(200).send({n:'4',message:'No tienes permiso para negar la donación.'});
    }
    Donacion.findByIdAndUpdate(donacionId,{estado:'negado'},{new:true},(err,donacion)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la petición de búsqueda.'});
        if(!donacion) return res.status(404).send({n:'2',message:'No se pudo negar la donación'});
        return res.status(200).send({n:'1',donacion});
   })


}
function filtroDonaciones(req,res){

    var id = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 9;
    var params = req.body;

    console.log(params)
    var t;
    
    params.forEach(p=> {
        if(p.tipo == 'tipo'){
            t = p.option
        }

    });
    if(t != undefined ){
        Donacion.find({tipo:t, fundacion:id}).populate('donanteR').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, donaciones,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(donaciones.length == 0) return res.status(404).send({n:'2',message:'no se encontro donaciones'});
            return res.status(200).send({
               n:'1',
               donaciones,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    

}
module.exports={
    probando,
    nuevaDonacion,
    obtenerDonacion,
    obtenerDonaciones,
    subirComprobante,
    obtenerComprobante,
    aprobarDonacion,
    negarDonacion,
    filtroDonaciones
}