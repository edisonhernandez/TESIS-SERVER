'use strict'
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Mascota = require('../models/mascota');
var Foto = require('../models/fotos');
var Adopcion = require('../models/adopcion');
var Usuario = require('../models/usuario');
var Notificacion = require('../models/notificacion');
function probando(req,res){
    res.status(200).send({
        message:'Hola desde el controlador de mascotas'
    })
}

//registrar una nueva mascota
function nuevaMascota(req,res){
    var usuarioId = req.params.id;
    var params = req.body;
    if( !params.nombre && !params.sexo && !params.edad && !params.tipoMascota && !params.raza) return res.status(200).send({n:'5',message:'Llena todos los campos necesarios'});

    var mascota = new Mascota();
    
    mascota.nombre = params.nombre;
    mascota.sexo = params.sexo;
    mascota.meses = params.meses;
    mascota.raza = params.raza;
    mascota.especie = params.especie;
    mascota.responsable = req.usuario.sub;
    mascota.descripcion = params.descripcion;
    mascota.anios = params.anios;
    mascota.tamanio = params.tamanio;
    mascota.esterilizado = params.esterilizado;
    mascota.color = params.color;

    if(params.especie == 'Canino'){
        var vcns = {
            Puppy:Boolean,
            Multiple:Boolean,
            Antirrabica :Boolean,
            Bronchicine:Boolean
        }
        vcns.Puppy = params.vpp;
        vcns.Multiple = params.vm;
        vcns.Antirrabica = params.va;
        vcns.Bronchicine = params.vb;

        mascota.vacunas = vcns;
    }else{
        var vcns = {
            TrFelina:Boolean,
            Antirrabica :Boolean
        }
        vcns.Antirrabica = params.va;
        vcns.TrFelina = params.vpp;

        mascota.vacunas = vcns;
       
    }
   
    mascota.edadT = params.edadT;
    mascota.estado = "activo";
    mascota.creadoEn = moment().unix();
    mascota.fotos = null;
    if(usuarioId != req.usuario.sub){
        return res.status(200).send({n:'4',message:'No puedes registrar una mascota desde otra cuenta'})

    }

    
    mascota.save((err,mascotaStored)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion de registro de la mascota'})

        if(!mascotaStored) return res.status(404).send({n:'2',message:'No se pudo registrar la mascota'});

        return res.status(200).send({n:'1',message:'Registro exitoso',mascota:mascotaStored});
    })


}

//actualizar datos de la mascota
function actualizarMascota(req,res){
    var usuarioId = req.params.id;
    var update = req.body;
    var mascotaId = req.params.mid;


    console.log(update)
    if(update.especie == 'Canino'){
        var vcns = {
            Puppy:Boolean,
            Multiple:Boolean,
            Antirrabica :Boolean,
            Bronchicine:Boolean
        }
        vcns.Puppy = update.vpp;
        vcns.Multiple = update.vm;
        vcns.Antirrabica = update.va;
        vcns.Bronchicine = update.vb;

        update.vacunas = vcns;
    }else{
        var vcns = {
            TrFelina:Boolean,
            Antirrabica :Boolean
        }
        vcns.Antirrabica = update.va;
        vcns.TrFelina = update.vpp;

        update.vacunas = vcns;
       
    }
    if(usuarioId != req.usuario.sub){
        return res.status(500).send({n:'4',message:'No tienes permiso para actualizar los datos de la mascota'});
    }

    Mascota.findByIdAndUpdate(mascotaId,update,{new:true},(err,mascotaActualizada)=>{
        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
        if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se ha podido actualizar los datos la mascota'});
        return res.status(200).send({n:'1', message:'Datos actualizados correctamente',mascota:mascotaActualizada});
    })
}


//obtener una mascota
function obtenerMascota(req,res){
    var mascotaId = req.params.id;

    Mascota.findOne({'_id':mascotaId, 'estado':'activo'}).populate('responsable').exec((err,mascota)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener la información de la mascota.'});
        if(!mascota) return res.status(404).send({n:'2',message:'La mascota no existe.'});
        return res.status(200).send({n:'1',mascota});
    })
}

//listado de las mascotas
function obtenerMascotas(req,res){
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Mascota.find({estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
        if(err) return res.status(500).send({n:'3',message:'Lo sentimos, algo salió mal al procesar la solicitud. Inténtalo de nuevo mas tarde.'});

      
        if(mascotas && mascotas.length > 0){
            return res.status(200).send({
                n:'1',
                mascotas,
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
            });
        }else{
            return res.status(404).send({n:'2',message:'no existe animales de compañia registrados.'});
        }
     
          
        
 
    });
}

//listado de las mascotas segun fundacion
function obtenerMisMascotas(req,res){
  
    var usuarioId = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 8;

    Mascota.find({responsable:usuarioId, 'estado':'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
        if(err) return res.status(500).send({n:'3',message:'Lo sentimos, algo salió mal al procesar la solicitud. Inténtalo de nuevo mas tarde.'});

        if(mascotas && mascotas.length > 0) {
            return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
            });
        }else{
            return res.status(404).send({n:'2',message:'no existe animales de compañia registrados.'});
        }
        
        
        
         
             
          
        
 
    });
}

function obtFotosMascota(req,res){
    var mascotaId;
    if(req.params.id){
        mascotaId = req.params.id;
    }

    Foto.find({idMascota:mascotaId} ,(err, fotosMascota)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener las fotos de la mascota'});
        if(fotosMascota.length == 0) return res.status(404).send({n:'2',message:'No existe fotos de la mascota'});
        
        return res.status(200).send({
            n:'1',
            fotosMascota,
    
        });

    })

}



//subir una foto de mascotas
function subirFotoMascota(req,res){
    var params = req.body;
   // var usuarioId = req.params.id;
    var idMascota = req.params.mid;
    
    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        var foto = new Foto();
        foto.name = file_name;
        foto.estado = 'desactivo';
        foto.creadoEn = moment().unix();
        
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
                
            Mascota.findById(idMascota ,(err, mascota)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener las fotos de la mascota'});
                if(mascota.fotos == null) {
                    Mascota.findByIdAndUpdate(idMascota,{fotos:foto},{new:true},(err,mascotaActualizada)=>{
                        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
                        if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se ha podido actualizar los datos la mascota'});
                        return res.status(200).send({n:'1', message:'Datos actualizados correctamente',mascota:mascotaActualizada});
                    })
                }
                if(mascota.fotos.length > 0){
                    
                    var fotosClea = [];

                    mascota.fotos.forEach((fot)=>{
                        fotosClea.push(fot);
                        
                    });

                    fotosClea.push(foto);
                    Mascota.findByIdAndUpdate(idMascota,{fotos:fotosClea},{new:true},(err,mascotaActualizada)=>{
                        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
                        if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se ha podido actualizar los datos la mascota'});
                        return res.status(200).send({n:'1', message:'Datos actualizados correctamente',mascota:mascotaActualizada});
                    })
                }

              
        
            })

        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({n:'1',message:'No se han subido archivos'});
    }

}

//subir una foto de mascotas
function subirFotoNuevaMascota(req,res){
    var params = req.body;
   // var usuarioId = req.params.id;
    var idMascota = req.params.mid;
    
    if(req.files){
        var file_path = req.files.foto.path;
       // console.log(file_path);
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        var foto = new Foto();
        foto.name = file_name;
        foto.estado = 'activo';
        foto.creadoEn = moment().unix();
        
        if(file_ext == 'png' ||file_ext == 'jpg' || file_ext == 'jpeg' || 
        file_ext == 'gif'){
            //actualizar documento de usuario
                
            Mascota.findById(idMascota ,(err, mascota)=>{
                if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener las fotos de la mascota'});
                if(mascota.fotos == null) {
                    Mascota.findByIdAndUpdate(idMascota,{fotos:foto},{new:true},(err,mascotaActualizada)=>{
                        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
                        if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se ha podido actualizar los datos la mascota'});
                        return res.status(200).send({n:'1', message:'Datos actualizados correctamente',mascota:mascotaActualizada});
                    })
                }

              
        
            })

        }else{
            return removeFiles(res,file_path,'Extension no valida','2');
        }
    }else{
        return res.status(200).send({n:'1',message:'No se han subido archivos'});
    }

}

function removeFiles(res,file_path, message,n){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({n,message:message});

        });
}

//eliminar mascota por completo
async function borrarMascota(req,res){
    var mascotaId = req.params.id;

    try {
        await Notificacion.find({mascota:mascotaId}).deleteMany();
    
        const mascota = await Mascota.findById(mascotaId).deleteOne();
        
        if(mascota.n == 1){
            console.log(mascota)
            res.status(200).send({ n:'1',message:'Mascota eliminada'});
        }else{
            res.status(200).send({ n:'0',message:'La mascota ya no existe en el sistema'});
        }
        
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
   

    /*Mascota.find({'responsable':req.usuario.sub,'_id':mascotaId}).remove((err,pbRemove)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})
        
        if(!pbRemove) return res.status(404).send({message:'No se pudo eliminar la mascota'});

        return res.status(200).send({message:'mascota eliminada'});
    })*/
}

//eliminar mascota, cambiando el estado a eliminado
function eliminarMascotaEstado(req,res){
    var mascotaId = req.params.id;
    var update = req.body;
    
    if(req.usuario.sub != update.responsable._id){
        return res.status(200).send({n:'4',message:'No tienes permisos.'});
    }
    Mascota.findByIdAndUpdate(mascotaId,{estado:'eliminado'},{new:true},(err,mascotaEliminada)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion.'})
        if(!mascotaEliminada) return res.status(404).send({n:'2',message:'No se pudo eliminar la mascota.'});
        return res.status(200).send({n:'1',mascota:mascotaEliminada});
    })


}
function prueba(req,res){
    var idMascota = req.params.id;

    Mascota.findById(idMascota, (err,mascota)=>{
        if(err) return res.status(500).send({n:'3',message:'Error en la peticion de obtener las fotos de la mascota'});
        if(mascota.foto.length == 0) {
            return res.status(200).send({n:'3',message:'bien'});
        }
        
        if(mascota.foto.length >= 1)
        return res.status(200).send({
            n:'1',
            mascotaFotos:mascota.foto,
    
        });
    })


}

//Inhabilitar el estado de una mascota
/*function desactivarMascota(req,res){
    var usuarioId = req.params.id;
    var update;
    update.estado =
    var mascotaId = req.params.mid;

    if(usuarioId != req.usuario.sub){
        return res.status(500).send({message:'No tienes permiso para actualizar los datos de la mascota'});
    }

    Mascota.findOneAndUpdate(mascotaId,update,{new:true},(err,mascotaActualizada)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(!mascotaActualizada) return res.status(404).send({message:'no se ha podido actualizar la mascota'});
        return res.status(200).send({mascota:mascotaActualizada});
    })
}*/

//retornar la imagen de una mascota
function obtenerImagenMascota(req,res){
    var imagen_file = req.params.imageFile;
    var path_file = './descargas/mascotas/'+imagen_file;
    
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'})
        }
    })
}

function eliminarFotoMascotaa(req,res){
    var mascotaId = req.params.mid;
    var fotoId = req.params.id;
    var file_path = req.params.file_path

    Mascota.findById(mascotaId, (err,mascota)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})
        
        if(!pbRemove) return res.status(404).send({message:'No se pudo eliminar la mascota'});

        if(pbRemove){
            removeFiles(res,file_path,'Foto eliminada','1')
        }
       
    })
}
function eliminarFotoMascota(req,res){
    var mascotaId = req.params.mid;
    var fotoId = req.params.id;
    var file_path = req.params.file_path

    Mascota.findById(mascotaId, (err,mascota)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'})
        
        if(!mascota) return res.status(404).send({message:'No se pudo encontrar la mascota'});

        if(mascota){


            var fotosClea = [];

            mascota.fotos.forEach((fot)=>{
                fotosClea.push(fot);
            });

            fotosClea.forEach((f,index)=>{
                if(f._id == fotoId){
                    if(f.estado == 'activo'){
                        return res.status(200).send({n:'5',message:'Imagen de perfil'});
                    }else{
                        fotosClea.splice(index,1)
                        Mascota.findByIdAndUpdate(mascotaId,{fotos:fotosClea},{new:true},(err,mascotaActualizada)=>{
                            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
                            if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se ha podido actualizar los datos la mascota'});
                            if(mascotaActualizada){
                                removeFiles(res,file_path,'Foto eliminada','1')
                            }
                        })
                    }
                    
                }
            })




            
        }
       
    })
}

//actualizar foto principal de la mascota
function actualizarFPMascota(req,res){
   
    var update = req.body;
    var mascotaId = req.params.mid;
    var idF = req.params.idF;
    
    Mascota.findById(mascotaId,(err,mascota)=>{
        if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
        if(!mascota) return res.status(404).send({n:'2',message:'No existe la mascota'});
        if(mascota){


            var fotosClea = [];

            mascota.fotos.forEach((fot)=>{
                if(fot.estado == 'activo' && fot._id != idF){
                    fot.estado = 'desactivo'
                }
                if(fot._id == idF){
                    fot.estado = 'activo'
                  
                }
                fotosClea.push(fot);
                
            });

            Mascota.findByIdAndUpdate(mascotaId,{fotos:fotosClea},{new:true},(err,mascotaActualizada)=>{
                if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
                if(!mascotaActualizada) return res.status(404).send({n:'2',message:'No se pudo actualizar la foto'});
                return res.status(200).send({n:'1', message:'Foto actualizada correctamente',mascota:mascotaActualizada});
            })
            
        }

    })
}
function filtroMascotas(req,res){


    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 9;
    var params = req.body;

    console.log(params)
    var t;
    var s;
    var e;
    params.forEach(p=> {
        if(p.tipo == 'tam'){
            t = p.option
        }
        if(p.tipo == 'sexo'){
            s = p.option
        }
        if(p.tipo == 'edad'){
            e = p.option
        }
    });
    if(t != undefined && s != undefined && e != undefined){
        Mascota.find({tamanio:t,sexo:s, edadT:e, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    if(t != undefined && s == undefined && e == undefined){
        Mascota.find({tamanio:t, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }

    if(t == undefined && s != undefined && e == undefined){
        Mascota.find({sexo:s, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }
    if(t == undefined && s == undefined && e != undefined){
        Mascota.find({edadT:e, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }

    if(t != undefined && s != undefined && e == undefined){
        Mascota.find({tamanio:t,sexo:s, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    if(t != undefined && s == undefined && e != undefined){
        Mascota.find({tamanio:t, edadT:e, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    if(t == undefined && s != undefined && e != undefined){
        Mascota.find({sexo:s, edadT:e, estado:'activo'}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    console.log(t+" "+s+" "+e)
  /*  if(params[0].length > 0 || params[1].length > 0 || params[2].length > 0){
        console.log("aaa1")
        if(t1!=undefined){
            t1f = t1;
        }
        if(t2!=undefined){
            t2f = t2;
        }
        if(t3!=undefined){
            t3f = t3;
        }

        if(s1!=undefined){
            s1f = s1;
        }
        if(s2!=undefined){
            s2f = s2;
        }

        if(e1!=undefined){
            e1f = e1;
        }
        if(e2!=undefined){
            e2f = e2;
        }
        if(e3!=undefined){
            e3f = e3;
        }


        if(params[0].length > 0 && params[1].length > 0 && params[2].length > 0){
            
           
            
            Mascota.find({tamanio:{$in:[t1f,t2f,t3f]},sexo:{$in:[s1f,s2f]}, edadT:{$in:[e1f,e2f,e3f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[0].length > 0 && params[1].length > 0 && params[2].length == 0){
            Mascota.find({tamanio:{$in:[t1f,t2f,t3f]},sexo:{$in:[s1f,s2f]} , estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[0].length > 0 && params[2].length > 0 && params[1].length == 0){
            
    
           
            Mascota.find({tamanio:{$in:[t1f,t2f,t3f]},edadT:{$in:[e1f,e2f,e3f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[1].length > 0 && params[2].length > 0 && params[0].length == 0){
            Mascota.find({sexo:{$in:[s1f,s2f]},edadT:{$in:[e1f,e2f,e3f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[0].length > 0 && params[1].length == 0 && params[2].length == 0){
            Mascota.find({tamanio:{$in:[t1f,t2f,t3f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[1].length > 0 && params[2].length == 0 && params[0].length == 0){
            Mascota.find({sexo:{$in:[s1f,s2f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
                total,
                itemsPerPage,
                pages:Math.ceil(total/itemsPerPage)
             });
            })
         }

         if(params[2].length > 0 && params[1].length == 0 && params[0].length == 0){
            Mascota.find({edadT:{$in:[e1f,e2f,e3f]}, estado:'activo'}).sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
             if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
             if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
             return res.status(200).send({
                n:'1',
                mascotas,
                
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
function filtroMascotas2(req,res){

    var id = req.params.id;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 9;
    var params = req.body;

    console.log(params)
    var t;
    var s;
    var e;
    params.forEach(p=> {
        if(p.tipo == 'tam'){
            t = p.option
        }
        if(p.tipo == 'sexo'){
            s = p.option
        }
        if(p.tipo == 'edad'){
            e = p.option
        }
    });
    if(t != undefined && s != undefined && e != undefined){
        Mascota.find({tamanio:t,sexo:s, edadT:e, responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    if(t != undefined && s == undefined && e == undefined){
        Mascota.find({tamanio:t,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }

    if(t == undefined && s != undefined && e == undefined){
        Mascota.find({sexo:s,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }
    if(t == undefined && s == undefined && e != undefined){
        Mascota.find({edadT:e,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
    }

    if(t != undefined && s != undefined && e == undefined){
        Mascota.find({tamanio:t,sexo:s,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

    if(t != undefined && s == undefined && e != undefined){
        Mascota.find({tamanio:t, edadT:e,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }
    if(t == undefined && s != undefined && e != undefined){
        Mascota.find({sexo:s, edadT:e,  responsable:id, $or:[{estado:'activo'},{estado:'adoptado'}]}).populate('responsable').sort({creadoEn:-1}).paginate(page,itemsPerPage,(err, mascotas,total)=>{
            if(err) return res.status(500).send({n:'3',message:'error en la peticion'});
            if(mascotas.length == 0) return res.status(404).send({n:'2',message:'no se encontro mascotas'});
            return res.status(200).send({
               n:'1',
               mascotas,
               total,
               itemsPerPage,
               pages:Math.ceil(total/itemsPerPage)
            });
           })
       
    }

}

module.exports={
    probando,
    nuevaMascota,
    obtenerMascota,
    obtenerMascotas,
    subirFotoMascota,
    actualizarMascota,
    borrarMascota,
    obtenerImagenMascota,
    obtFotosMascota,
    obtenerMisMascotas,
    subirFotoNuevaMascota,
    eliminarFotoMascota,
    actualizarFPMascota,
    filtroMascotas,
    filtroMascotas2,
    eliminarMascotaEstado

   // desactivarMascota
}