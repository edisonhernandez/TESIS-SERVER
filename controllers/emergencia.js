'use strict'
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var Usuario = require('../models/usuario');
var Emergencia = require('../models/emergencia');
var Ayuda = require('../models/ayuda');
function probando(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de emergencias'
    })
}
//registrar una nueva emergencia
function nuevaEmergencia(req,res){
    var params = req.body;
    if(!params.tipoEmergencia && !params.nivelEmergencia && !params.sexoMascota && !params.tipoMascota && !params.direccionSector && !params.direccionCprincipal && !params.direccionCsecundaria && !params.direccionReferencia && !params.estadoMascota) return res.status(200).send({message:'Llena todos los campos necesarios'});

    var emergencia = new Emergencia();
    
    emergencia.tipoEmergencia = params.tipoEmergencia;
    emergencia.nivelEmergencia = params.nivelEmergencia;
    emergencia.sexoMascota = params.sexoMascota;
    emergencia.raza = params.raza;
    emergencia.estadoMascota = params.estadoMascota;
    emergencia.tipoMascota = params.tipoMascota;
    emergencia.fotoMascota = null;
    emergencia.direccionSector = params.direccionSector;
    emergencia.direccionCprincipal = params.direccionCprincipal;
    emergencia.direccionCsecundaria = params.direccionCsecundaria;
    emergencia.direccionReferencia = params.direccionReferencia;
    emergencia.direccionFoto = null;

    emergencia.contactoExtra = params.contactoExtra;
    emergencia.descripcion = params.descripcion;
    emergencia.responsable = req.usuario.sub;
    emergencia.estado = "pendiente";
    emergencia.creadoEn = moment().unix();

    
    emergencia.save((err,emergenciaStored)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})

        if(!emergenciaStored) return res.status(404).send({message:'No se pudo registrar la emergencia'});

        return res.status(200).send({emergencia:emergenciaStored});
    })


}

//actualizar datos de la emergencia
function actualizarEmergencia(req,res){
    var usuarioId = req.params.id;
    var update = req.body;
    var emergenciaId = req.params.eid;

    if(req.usuario.rol != 1){
        return res.status(500).send({message:'No tienes permiso para actualizar los datos de la emergencia'});
    }

    Emergencia.findOneAndUpdate(emergenciaId,update,{new:true},(err,emergenciaActualizada)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(!emergenciaActualizada) return res.status(404).send({message:'no se ha podido actualizar la emergencia'});
        return res.status(200).send({emergencia:emergenciaActualizada});
    })
}

//marcar la emergencia como atentida
function marcarAtentidaEmergencia(req,res){
    var fundacionId = req.params.fid;
    var emergenciaId = req.params.eid;
    var update;
    
    Emergencia.find({'_id':emergenciaId,'ayuda.fundacion':fundacionId}).exec((err,ayuda)=>{
        if(err) return res.status(500).send({n:'5',message:'Error en la peticion de requisitos'});
        if(ayuda.length == 0) return res.status(404).send({n:'4',message:'No tienes permiso para actualizar el estado de la emergencia.'});

        if(ayuda.length > 0){
            Emergencia.findByIdAndUpdate(emergenciaId,{estado:'atentida'},{new:true},(err,emergencia)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de actualización del estado.'});
                if(!emergencia) return res.status(404).send({n:'2',message:'No existe la emergencia.'});
                return res.status(200).send({n:'1',emergencia});
            })
 
        }
    })
    

 
}
//eliminar emergencia
function borrarEmergencia(req,res){
    var emergenciaId = req.params.id;
    
    Emergencia.find({'responsable':req.usuario.sub,'_id':emergenciaId}).remove(err=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})
        
        //if(!mascotaBorrada) return res.status(404).send({message:'No se pudo eliminar la mascota'});

        return res.status(200).send({message:'emeergencia eliminada'});
    })
}
//devolver datos de una emergencia
function obtenerEmergencia(req,res){
    var emergenciaId = req.params.id;

    Emergencia.findById(emergenciaId).populate('responsable').populate('ayuda.fundacion').exec((err,emergencia)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        
        if(!emergencia) return res.status(404).send({message:'La emergencia no existe'});

        return res.status(200).send({emergencia});
    })
}

//listado de emergencias paginadas
function obtenerEmergencias(req,res){
    //var identity_usuario_id  = req.usuario.sub;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    Emergencia.find({estado:'pendiente'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion'});

        if(emergencias && emergencias.length > 0) {
            return res.status(200).send({
                n:'1',
                emergencias,
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
            });
            
        }else{
            return res.status(404).send({n:'2',message:'No existe emergencias'});
        }
      
    });
}

function filtroEmergencias(req,res){
    
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 9;
    var params = req.body;
    console.log(params)
    var t;
    var n;
   
    params.forEach(p=> {
        if(p.tipo == 'tipoE'){
            t = p.option
        }
        if(p.tipo == 'nivelE'){
            n = p.option
        }

    });

    if(t != undefined && n != undefined){
        console.log("entro2")
        Emergencia.find({tipoEmergencia:t,nivelEmergencia:n,estado:'pendiente'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
            return res.status(200).send({
               n:'1',
               emergencias,
               
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    if(t != undefined && n == undefined){
        console.log("entro3")
        Emergencia.find({tipoEmergencia:t,estado:'pendiente'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
            return res.status(200).send({
               n:'1',
               emergencias,
               
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    if(t == undefined && n != undefined){
        console.log("entro4")
        Emergencia.find({nivelEmergencia:n,estado:'pendiente'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
            return res.status(200).send({
               n:'1',
               emergencias,
               
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    /*

    if(params[0].length > 0 || params[1].length > 0){
        
        if(t1!=undefined){
            t1f = t1;
        }
        if(t2!=undefined){
            t2f = t2;
        }
        if(t3!=undefined){
            t3f = t3;
        }
        if(t4!=undefined){
            t4f = t4;
        }
        if(t5!=undefined){
            t5f = t5;
        }
        if(t6!=undefined){
            t6f = t6;
        }


        if(n1!=undefined){
            n1f = n1;
        }
        if(n2!=undefined){
            n2f = n2;
        }
        if(n3!=undefined){
            n3f = n3;
        }
        if(n4!=undefined){
            n4f = n4;
        }
        if(n5!=undefined){
            n5f = n5;
        }


        if(params[0].length > 0 && params[1].length > 0 ){
            
         
            Emergencia.find({tipoEmergencia:{$in:[t1f,t2f,t3f,t4f,t5f,t6f]},nivelEmergencia:{$in:[n1f,n2f,n3f,n4f,n5f]}}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
             return res.status(200).send({
                n:'1',
                emergencias,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[0].length > 0 && params[1].length == 0){
            Emergencia.find({tipoEmergencia:{$in:[t1f,t2f,t3f,t4f,t5f,t6f]}}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, emergencias,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
             return res.status(200).send({
                n:'1',
                emergencias,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[0].length == 0 && params[1].length > 0){
            
    
           
            Emergencia.find({nivelEmergencia:{$in:[n1f,n2f,n3f,n4f,n5f]}}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err,emergencias,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(emergencias.length == 0) return res.status(404).send({n:'2',message:'no se encontro emergencias'});
             return res.status(200).send({
                n:'1',
                emergencias,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }




    }else{
        return res.status(404).send({n:'5', message:'No se ha elegido filtros'});
    }
*/
}

//subir una foto de la mascota en emergencia
function subirFotoMascotaEmergencia(req,res){
    var usuarioId = req.params.id;
    var emergenciaId = req.params.eid;

    if(req.files){
        var file_path = req.files.fotoMascota.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(usuarioId != req.usuario.sub){
            return removeFiles(res,file_path,'No tienes permiso para actualizar los datos de la emergencia');

        }
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
           Emergencia.findByIdAndUpdate(emergenciaId,{fotoMascota:file_name},{new:true},(err,emergenciaActualizado)=>{
                if(err) return res.status(500).send({message:'error en la peticion'});
                if(!emergenciaActualizado) return res.status(404).send({message:'no se ha podido actualizar la emrgencia'});
                return res.status(200).send({emergencia:emergenciaActualizado});
            })
        }else{
            return removeFiles(res,file_path,'Extension no valida');
        }
    }else{
        return res.status(200).send({message:'No se han subido archivos'});
    }

}



//subir una foto de la direccion o referencia del lugar de la emergencia
function subirFotoDireccionEmergencia(req,res){
    var usuarioId = req.params.id;
    var emergenciaId = req.params.eid;

    if(req.files){
        var file_path = req.files.direccionFoto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(usuarioId != req.usuario.sub){
            return removeFiles(res,file_path,'No tienes permiso para actualizar los datos de la emergencia');

        }
      
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
           Emergencia.findByIdAndUpdate(emergenciaId,{direccionFoto:file_name},{new:true},(err,emergenciaActualizado)=>{
                if(err) return res.status(500).send({message:'error en la peticion'});
                if(!emergenciaActualizado) return res.status(404).send({message:'no se ha podido actualizar la emrgencia'});
                return res.status(200).send({emergencia:emergenciaActualizado});
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

//retornar la imagen de una mascota en emergencia o imagen de la direccion
function obtenerImagenEmergencia(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/emergencias/'+imagen_file;
    console.log(path_file);
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}



//registrar una ayuda
function nuevaAyuda(req,res){
    
    var emeergenciaId = req.params.eid;
    var update = req.body;

    
    
    Emergencia.find({$or:[
        {'_id':emeergenciaId,'estado':'atentida'},
        {'_id':emeergenciaId,'estado':'acogida'}
    
    ]}).exec((err,emergencia)=>{
        if(err) return res.status(500).send({n:'7',message:'Error en la petición de comprobar ayuda.'})
        if(emergencia && emergencia.length > 0) {
            return res.status(404).send({n:'6',message:'La emergencia ya fue atentida por otra fundación.'});
        }else{
           
            Emergencia.findByIdAndUpdate(emeergenciaId,{'estado':'acogida','ayuda.fundacion':update.fundacion,'ayuda.voluntarios':update.voluntarios},{new:true},(err,emergenciaActualizada)=>{
                        if(err) return res.status(500).send({n:'3',message:'Error en la petición de actualizar emergencia'})
                        if(!emergenciaActualizada) return res.status(404).send({n:'2',message:'No existe la emergencia'});
                        return res.status(200).send({
                            n:'1',
                            emergencia:emergenciaActualizada,
                            });
                    })
                
                
          
        }
        
        
    })



}


module.exports={
    probando,
    nuevaEmergencia,
    actualizarEmergencia,
    borrarEmergencia,
    obtenerEmergencia,
    obtenerEmergencias,
    subirFotoMascotaEmergencia,
    subirFotoDireccionEmergencia,
    obtenerImagenEmergencia,
    marcarAtentidaEmergencia,
    nuevaAyuda,
    filtroEmergencias
}