'use strict'


var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Ayuda = require('../models/ayuda');
var Emergencia = require('../models/emergencia');
function probando(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de ayudas'
    })
}

//registrar una ayuda
function nuevaAyuda(req,res){
    var params = req.body;
    if(!params.emergencia) return res.status(200).send({message:'Llena todos los campos necesarios'});

    var ayuda = new Ayuda();
    
    ayuda.emergencia = params.emergencia;
    ayuda.fundacion = req.usuario.sub;
    ayuda.voluntarios = params.voluntarios;
    ayuda.creadoEn = moment().unix();
    ayuda.aprobado= "no";
    
    Emergencia.find({'_id':ayuda.emergencia,'estado':'atentida'}).exec((err,emergencia)=>{
        if(err) return res.status(500).send({n:'7',message:'Error en la petición de comprobar ayuda.'})
        if(emergencia && emergencia.length > 0) {
            return res.status(404).send({n:'6',message:'La emergencia ya fue atentida por otra fundación.'});
        }else{
            ayuda.save((err,ayudaStored)=>{
                if(err) return res.status(500).send({n:'5',message:'Error en la petición de guardar la ayuda'})
        
                if(!ayudaStored) return res.status(404).send({n:'4',message:'No se pudo registrar la ayuda'});
        
                if(ayudaStored){
                    Emergencia.findByIdAndUpdate(ayuda.emergencia,{'estado':'acogida'},{new:true},(err,emergenciaActualizada)=>{
                        if(err) return res.status(500).send({n:'3',message:'Error en la petición de actualizar emergencia'})
                        if(!emergenciaActualizada) return res.status(404).send({n:'2',message:'No existe la emergencia'});
                        return res.status(200).send({
                            n:'1',
                            emergencia:emergenciaActualizada,
                            ayuda:ayudaStored});
                    })
                }
                
            })
        }
        
        
    })



}

//aprobar la ayuda de un usuario
//actualizar usuarios
function aprobarAyuda(req,res){
    var ayudaId = req.params.id;
   

    if(req.usuario.rol == 3  || req.usuario.rol == 2){
        return res.status(500).send({message:'No tienes permiso para aprobar la ayuda'});
    }

    Ayuda.findByIdAndUpdate(ayudaId,{aprobado:"si"},{new:true},(err,ayudaActualizado)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(!ayudaActualizado) return res.status(404).send({message:'no se ha podido aprobar'});
        return res.status(200).send({ayuda:ayudaActualizado});
    })
}
//obtener la ayuda segun el id de la emergencia
function obtenerAyuda(req,res){
    var emergenciaId = req.params.id;

    Ayuda.find({emergencia:emergenciaId}).populate('fundacion').exec((err,ayuda)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la petición de busqueda de la ayuda'});
        if(ayuda && ayuda.length > 0) {
            return res.status(200).send({n:'1', ayuda});
        }else{
            return res.status(404).send({n:'2',message:'No existe la ayuda especificada.'});
        }
    })
}

module.exports={
    probando,
    nuevaAyuda,
    aprobarAyuda,
    obtenerAyuda
}