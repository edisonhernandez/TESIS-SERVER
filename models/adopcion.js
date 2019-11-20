'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdopcionSchema = Schema({ 
    fundacion:{type:Schema.ObjectId, ref:'Usuario'},
    adoptante:{type:Schema.ObjectId, ref:'Usuario'},
    mascota:{type:Schema.ObjectId, ref:'Mascota'},
    /*--DATOS PARA ADOPCION--*/
    datosAdopcion:{
        
        cedula:String,
        ocupacion:String,
      
        telefono:String,
        celular:String,
        instruccion:String,
        direccion:String,
        //referencias personales
        nombresRP:String,
       // parentescoRP:String,
        telefonoRP:String,
        //situacion familiar
        numPersonas:String,
        familiarEmbarazo:{type:String, enum:['Si','No']},
        familiarAlergico:{type:String, enum:['Si','No']},
        //domicilio
        inmueble:String,
        //mudarse:{type:String, enum:['si','no']},//¿PLANEA MUDARSE PROXIMAMENTE?
        cerramiento:{type:String, enum:['Si','No']}, //EL LUGAR DONDE PASARÁ EL CANINO, ¿TIENE CERRAMIENTO?
        //relacion con los animales
        //tieneMascotas:{type:String, enum:['si','no']},
        numMascotas:String,//ha tenido o tiene mascotas? cuantas.
        estadoMascotas:String,//en que estado se encuentran las mascotas?
        //preguntas 
        deseoAdoptar:String, // porque desea adoptar una mascota
        cambiarDomicilio:String, // SI POR ALGÚN MOTIVO TUVIERA QUE CAMBIAR DE DOMICILIO, ¿QUÉ PASARÍA CON SU MASCOTA?
        //dueniosNCasa:String, //CON RELACIÓN A LA ANTERIOR PRGUNTA ¿QUÉ PASARIA SI LOS DUEÑOS DE LA NUEVA CASA NO ACEPTACEN MASCOTAS?
        salirViaje:String,//SI UD. DEBE SALIR DE VIAJE MÁS DE UN DÍA, LA MASCOTA:
        tiempoSolo:String,//¿CUÁNTO TIEMPO EN EL DÍA PASARÁ SOLA LA MASCOTA?
        dormirMS:String, //¿DÓNDE DORMIRÁ LA MASCOTA?
        //necesidadesMS:String, //¿DÓNDE HARÁ SUS NECESIDADES?
        comidaMS:String, //¿QUE COMERÁ HABITUALMENTE LA MASCOTA?
        enfermaMS:String,//SI SU MASCOTA ENFERMA USTED:
        cargoGastos:String, //¿QUIÉN SERÁ EL RESPONSABLE Y SE HARÁ CARGO DE CUBRIR LOS GASTOS DE LA MASCOTA?
        dineroMensualMS: String,//ESTIME CUÁNTO DINERO PODRÍA GASTAR EN SU MASCOTA MENSUALMENTE
        //recursos:String,//¿CUENTA CON LOS RECURSOS PARA CUBRIR LOS GASTOS VETERINARIOS DEL ANIMAL DE COMPAÑÍA?
        visitarDomicilio:String,//¿ESTA DE ACUERDO EN QUE SE HAGA UNA VISITA PERIÓDICA A SU DOMICILIO PARA VER COMO SE ENCUENTRA EL ADOPTADO?
        //esterilizadaMS:String ,//¿ESTÁ DE ACUERDO EN QUE LA MASCOTA SEA ESTERILIZADA? (OPERADA PARA NO TENER MAS CACHORROS)
        //beneficiosEsterilizacion:String,//¿CONOCE USTED LOS BENEFICIOS DE LA ESTERILIZACIÓN?
        //tenenciaResponsable:{type:String, enum:['si','no']},//SEGÚN USTED, ¿QUÉ ES TENENCIA RESPONSABLE?
        //ordenanzaTenencia:{type:String, enum:['si','no']},//¿ESTÁ UD. INFORMADO Y CONCIENTE SOBRE LA ORDENANZA MUNICIPAL SOBRE LA TENENCIA REPONSABLE DE MASCOTAS?
        compartidaFamilia:String, //¿LA ADOPCIÓN FUE COMPARTIDA CON su FAMILIA?
        //acuerdoFamilia:{type:String, enum:['totalmente de acuerdo','lo aceptan por ud', 'desacuerdo','indiferente']} ,//SU FAMILIA ESTÁ:
    },
    //observaciones de la fundaciones
    observaciones:String,
    fechaRespuesta:String,
    creadoEn:String,
    estado:String
});
module.exports = mongoose.model('Adopcione', AdopcionSchema);