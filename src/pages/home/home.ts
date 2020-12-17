import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';

import {PrintProvider} from '../../providers/print/print';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

usuario = null;
nombre = null;
fechasincronizado = null;
enlinea = null;
selectedPrinter:any=[];

constructor(public navCtrl: NavController, 
            public navParams: NavParams, 
            public alertCtrl: AlertController,
            public beanSeguridad: BeanSeguridad,  
            public tasksService: TasksServiceProvider,
            public loadingCtrl: LoadingController,
            private printProvider:PrintProvider) {
     
  this.usuario = beanSeguridad.USUARIO_LOGONEADO;
  this.nombre = beanSeguridad.NOMBRE_USUARIO;
  this.fechasincronizado = beanSeguridad.FECHASINCRONIZADO;
  this.enlinea =  beanSeguridad.EN_LINEA;
  
}

//Metodo Actualizar informacion
actualizarApp(){
  //Mensaje de Confirmacion del Pago
  let confirm = this.alertCtrl.create({
    title: 'Atención',
    message: 'Se actualizará la Información a la fecha actual:  ¿Esta seguró que desea actualizar?',
    buttons: [
      {
        text: 'Si',
        handler: () => {
          console.log('Yes selected');   
          this.sincronizacionInformacionCobranzas();
        }
      },
        { text: 'No',   handler: () => { console.log('No selected!'); }
      }
    ]
  });
  confirm.present();
}

//Sincronizar la Informacion del Usuario
sincronizacionInformacionCobranzas(){
  console.log("Inicio - sincronizacionInformacionCobranzas");
  //**************************************************************
  let loading = this.loadingCtrl.create({ content: 'Actualizando Información... <br><b>Por favor espere...</b>' });
  loading.present()
  //Cabecera Cartera
  .then(() => loading.setContent('Actualizando Información Cobranzas<b>(1/3)... <br>Por favor espere...</b>' ))
  .then(() => this.tasksService.eliminarTabla(this.tasksService.TABLA_COBCARTERACAB))
  .then(() => this.tasksService.crearTabla(this.tasksService.TABLA_COBCARTERACAB))
  .then(() => this.actualizarCarteraCabecera(0))
  //Detalles Cartera
  .then(() => loading.setContent('Actualizando Información Cobranzas<b>(2/3)... <br>Por favor espere...</b>' ))
  .then(() => this.tasksService.eliminarTabla(this.tasksService.TABLA_COBCARTERADET))
  .then(() => this.tasksService.crearTabla(this.tasksService.TABLA_COBCARTERADET))
  .then(() => this.actualizarCarteraDetalles(0))  
  //Actualizar Parametros Generales
  .then(() => loading.setContent('Actualizando Información Cobranzas<b>(3/3)... <br>Por favor espere...</b>' ))
  //.then(() => this.actualizarCobros(0))  
  .then(() => this.actualizarParametros()) 
  //Actualizar Usuario
  .then(() => this.validaSincronizacion()) 
  //Cierre Espera
  .then(() => loading.dismiss())
  //Refrescar Pantalla
  //.then(() => location.reload());
  .then(() => this.navCtrl.setRoot(HomePage, null)); 
  //**************************************************************
  console.log("Fin - sincronizacionInformacionCobranzas");
}


//Sincronizar la Informacion del Usuario
/*
sincronizacionInformacionPedidos(){
  console.log("Inicio - sincronizacionInformacionPedidos");
  //**************************************************************
  let loading = this.loadingCtrl.create({ content: 'Actualizando Información... <br><b>Por favor espere...</b>' });
  loading.present()
  //Cabecera Cartera
  .then(() => loading.setContent('Actualizando Información Pedidoa<b>(1/3)... <br>Por favor espere...</b>' ))
  .then(() => this.actualizarCarteraCabecera(0))
  //Detalles Cartera
  .then(() => loading.setContent('Actualizando Información Cobranzas<b>(2/3)... <br>Por favor espere...</b>' ))
  .then(() => this.actualizarCarteraDetalles(0))  
  //Actualizar Parametros Generales
  .then(() => loading.setContent('Actualizando Información Cobranzas<b>(3/3)... <br>Por favor espere...</b>' ))
  .then(() => this.actualizarParametros()) 
  //Actualizar Usuario
  .then(() => this.validaSincronizacion()) 
  //Cierre Espera
  .then(() => loading.dismiss())
  //Refrescar Pantalla
  //.then(() => location.reload());
  .then(() => this.navCtrl.setRoot(HomePage, null)); 
  //**************************************************************
  console.log("Fin - sincronizacionInformacionPedidos");
}
*/

/*** ACTUALIZAR CABECERA CARTERA */
actualizarCarteraCabecera(indice:any){

  //Variables
  let parametroWS:any;
  let respuestaWS:any;
  let sqlGeneral = 'INSERT OR REPLACE INTO [TABLA]([CAMPOS]) VALUES([VALORES]);';
  var sqlInsert:Array<string>= [];

  return new Promise((resolve, reject) => {

      //console.log("OBTENER_CARTERA_CAB ==> " + indice);
      parametroWS = {indice:indice}; 
      this.beanSeguridad.obtenerInformacionWS("OBTENER_CARTERA_CAB", parametroWS)
      .then(data => {
        respuestaWS = data;

        if(respuestaWS.exito == "true"){
          //Evaluo si es final de la actualizacion
          console.log("respuestaWS ==> " + respuestaWS.cantidad_registros + " loopExit: " + respuestaWS.final);

          //Inserta los Registros Obtenidos
          if((respuestaWS.cantidad_registros * 1) > 0){
            //Ajuste del query de insercion
            sqlGeneral = sqlGeneral.replace('[TABLA]',this.tasksService.TABLA_COBCARTERACAB)
            sqlGeneral = sqlGeneral.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, NOMBRECLIENTE, EMAILCLIENTE, CODIGOVENDEDOR, "+
                                            "USUARIOVENDEDOR, VENCIDO, XVENCER, AFAVOR, TOTAL");
            
            //console.log("sqlGeneral ==> " + sqlGeneral);               
            for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++) 
            {
              //console.log("insertar ==> " + respuestaWS.data[i].CODEMPRESA+" "+respuestaWS.data[i].CODCLIENTE);
              sqlInsert.push(sqlGeneral.replace('[VALORES]',"\""+respuestaWS.data[i].CODEMPRESA+"\","+ 
                                                            "\""+respuestaWS.data[i].CODCLIENTE+"\","+ 
                                                            "\""+respuestaWS.data[i].NOMBRECLIENTE+"\","+ 
                                                            "\""+respuestaWS.data[i].EMAILCLIENTE+"\","+ 
                                                            "\""+respuestaWS.data[i].CODIGOVENDEDOR+"\","+ 
                                                            "\""+respuestaWS.data[i].USUARIOVENDEDOR+"\","+ 
                                                            "\""+respuestaWS.data[i].VENCIDO+"\","+ 
                                                            "\""+respuestaWS.data[i].XVENCER+"\","+ 
                                                            "\""+respuestaWS.data[i].AFAVOR+"\","+ 
                                                            "\""+respuestaWS.data[i].TOTAL+"\""));
            }

            //Envio a Insertar en batch los registros obtenidos
            this.tasksService.db.sqlBatch(sqlInsert)
            .then(() => {
              console.log('Imported TABLA_COBCARTERACAB #'+indice); 
              sqlInsert = []; 
            })
            .catch(e => console.error(e));
          
            //Vuelve a llamar al Proceso - Si aun no termina la interaccion            
            if(respuestaWS.final != "true"){
              this.actualizarCarteraCabecera(indice+1)
              .then(data => { 
                console.log("Proceso Ejecutado");
                //Retorno Respuesta
                resolve(respuestaWS); 
              })
              .catch( error => { console.log("ERROR ==> " + JSON.stringify(error.json())); });
            }else{
              //Retorno Respuesta
              resolve(respuestaWS);
            }
          }else{
            resolve(respuestaWS);
          }

        }else{
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: ' Error ==> '+respuestaWS.mensaje,
            buttons: ["Aceptar"]
          });
          alert.present();
        }

        //Retorno Respuesta
        //resolve(respuestaWS);
      })
      .catch( error => {
        //console.log("ERROR ==> " + JSON.stringify(error.json()));
        reject(error.json());
      });
  })
}

actualizarCobros(indice:any){
  
  //Variables
  let parametroWS:any;
  let respuestaWS:any;
   
  return new Promise((resolve, reject) => {
    
    //Obtengo los cobros a validar
    this.tasksService.obtenerCobrosEstado('ENVIADO')
    .then(data => {
      if(data.length<=0){
        resolve(); 
        return;
      }

      //Recorro los registros encontrados
      let contador:any = 0;
      let cobrosEnvio: any = [];
      for(let i = 0; i < data.length; i++){
        cobrosEnvio.push({"EMPRESA":data[i].CODEMPRESA, "IDRECIBO":data[i].IDRECIBO});
        contador++;

        //Envio a verificar los cobros
        if(contador>= 15){
          //***********************************
          parametroWS = {detalles:JSON.stringify(cobrosEnvio)};
          this.beanSeguridad.obtenerInformacionWS("VALIDAR_COBROS", parametroWS)
          .then(data => {
            //Actualiza Cobros recibidos
            respuestaWS = data;
            if(respuestaWS.exito == "true"){
              for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++) 
              {
                this.tasksService.cambiarEstadoCobros(respuestaWS.data[i].EMPRESA,  respuestaWS.data[i].IDRECIBO, respuestaWS.data[i].ESTADO, null)
                .then(data => { console.log("Actualizado: "+respuestaWS.data[i].CODEMPRESA+"/"+ respuestaWS.data[i].IDRECIBO+"/"+respuestaWS.data[i].CODESTADO);});
              }
              //resolve();          
            }
            else{
              let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error ==> '+respuestaWS.mensaje,
                buttons: ["Aceptar"]
              });
              alert.present();
            }
          }).catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));
            //reject(error.json());
          });
          //***********************************
          
          cobrosEnvio = [];
          contador = 0;
        }            
      }
     
      

    }).catch( error => {
      console.log("ERROR ==> " + JSON.stringify(error.json()));
      reject(error.json());
    });
  })
}

/*** ACTUALIZAR DETALLES CARTERA */
actualizarCarteraDetalles(indice:any){
  
  //Variables  
  let parametroWS:any;
  let respuestaWS:any;
  let sqlGeneral = 'INSERT OR REPLACE INTO [TABLA]([CAMPOS]) VALUES([VALORES]);';
  var sqlInsert:Array<string>= [];

  return new Promise((resolve, reject) => {

      //console.log("OBTENER_CARTERA_DET ==> " + indice);
      //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO+"&indice="+indice;
      parametroWS = {indice:indice}; 
      this.beanSeguridad.obtenerInformacionWS("OBTENER_CARTERA_DET", parametroWS)
      .then(data => {
        respuestaWS = data;

        if(respuestaWS.exito == "true"){
          //Evaluo si es final de la actualizacion
          //if(respuestaWS.final == "true"){ this.loopExit = true; }
          console.log("respuestaWS ==> " + respuestaWS.cantidad_registros + " loopExit: " + respuestaWS.final);

          //Inserta los Registros Obtenidos
          if((respuestaWS.cantidad_registros * 1) > 0){
            //Ajuste del query de insercion
            sqlGeneral = sqlGeneral.replace('[TABLA]',this.tasksService.TABLA_COBCARTERADET)
            sqlGeneral = sqlGeneral.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, REFERENCIA, NUMCUOTA, "+
                                                       "NUMDOCUMENTO, FECHAEMISION, DIASFEMISION, VALORCUOTA, "+
                                                       "VALORCHEQUE, VALORSALDO, ORDENAMIENTO, VALORXAPLICAR ");

            for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++) 
            {
              //console.log("insertar ==> " + respuestaWS.data[i].CODEMPRESA+" "+respuestaWS.data[i].REFERENCIA+" "+respuestaWS.data[i].NUMDOCUMENTO);
              sqlInsert.push(sqlGeneral.replace('[VALORES]',"\""+respuestaWS.data[i].CODEMPRESA+"\","+ 
                                                            "\""+respuestaWS.data[i].CODCLIENTE+"\","+ 
                                                            "\""+respuestaWS.data[i].REFERENCIA+"\","+ 
                                                            "\""+respuestaWS.data[i].NUMCUOTA+"\","+ 
                                                            "\""+respuestaWS.data[i].NUMDOCUMENTO+"\","+ 
                                                            "\""+respuestaWS.data[i].FECHAEMISION+"\","+ 
                                                            "\""+respuestaWS.data[i].DIASFEMISION+"\","+ 
                                                            "\""+respuestaWS.data[i].VALORCUOTA+"\","+ 
                                                            "\""+respuestaWS.data[i].VALORCHEQUE+"\","+ 
                                                            "\""+respuestaWS.data[i].VALORSALDO+"\","+ 
                                                            "\""+respuestaWS.data[i].ORDENAMIENTO+"\","+ 
                                                            "\""+respuestaWS.data[i].VALORXAPLICAR+"\""));
            }

             //Envio a Insertar en batch los registros obtenidos
             this.tasksService.db.sqlBatch(sqlInsert)
             .then(() => {
               console.log('Imported TABLA_COBCARTERADET #'+indice); 
               sqlInsert = []; 
             })
             .catch(e => console.error(e));

            //Vuelve a llamar al Proceso
            if(respuestaWS.final != "true"){
              this.actualizarCarteraDetalles(indice+1)
              .then(data => { 
                console.log("Proceso Ejecutado");
                 //Retorno Respuesta
                 resolve(respuestaWS); 
              })
              .catch( error => { console.log("ERROR ==> " + JSON.stringify(error.json())); });
            }else{
              //Retorno Respuesta
              resolve(respuestaWS);
            }

          }else{
            //Terminado
            resolve(respuestaWS);
          }
            
        }else{
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: ' Error ==> '+respuestaWS.mensaje,
            buttons: ["Aceptar"]
          });
          alert.present();
        }

        //Retorno Respuesta
        //resolve(respuestaWS);

      })  
      .catch( error => {
        console.log("ERROR ==> " + JSON.stringify(error.json()));
        reject(error.json());
      });
  })
}


//*** ACTUALIZAR PARAMETROS *****
actualizarParametros(){
  //Variables
  let parametroWS:any;
  let respuestaWS:any;

  return new Promise((resolve, reject) => {

      //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO;
      parametroWS = {}; 
      this.beanSeguridad.obtenerInformacionWS("PARAMETROS_CXC", parametroWS)
      .then(data => {
        respuestaWS = data;

        if(respuestaWS.exito == "true"){
          //Parametros 
          this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"FORMASPAGO", VALOR:JSON.stringify(respuestaWS.formaspago)})
          .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"BANCOS", VALOR:JSON.stringify(respuestaWS.bancos)}))
          .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"TARJETAS", VALOR:JSON.stringify(respuestaWS.tarjetas)}))
          .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"CUENTAS", VALOR:JSON.stringify(respuestaWS.cuentas)}))
          .then(() =>  resolve(respuestaWS));
        }else{
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: ' Error ==> '+respuestaWS.mensaje,
            buttons: ["Aceptar"]
          });
          alert.present();
        }
        
      })
      .catch( error => {
        console.log("ERROR ==> " + JSON.stringify(error.json()));
        reject(error.json());
      });
  })
}



/*** ACTUALIZAR Fecha Ultima Sincronizacion */
validaSincronizacion(){

  //Variables
  let parametroWS:any;
  let respuestaWS:any;

  return new Promise((resolve, reject) => {

      console.log("VALIDASINCRONIZACION ==> ");
      //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO;
      parametroWS = {}; 
      this.beanSeguridad.obtenerInformacionWS("VALIDASINCRONIZACION", parametroWS)
      .then(data => {
        respuestaWS = data;

        if(respuestaWS.exito == "true"){

          this.tasksService.updateUsuario({CODUSUARIO:this.beanSeguridad.USUARIO_LOGONEADO, ULTIMAACTUALIZACION:respuestaWS.fecha, EMPRESAS:JSON.stringify(respuestaWS.empresas) })
          .then(data => { 
            console.log("Registro actualizado"); 
            this.beanSeguridad.FECHASINCRONIZADO = respuestaWS.fecha;
            this.beanSeguridad.SINCRONIZADO = true; 
            this.beanSeguridad.EMPRESAS = JSON.stringify(respuestaWS.empresas);
          }).catch( error => {  console.log("ERROR ==> " + JSON.stringify(error.json())); });
            
        }else{
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: ' Error ==> '+respuestaWS.mensaje,
            buttons: ["Aceptar"]
          });
          alert.present();
        }

        //Retorno Respuesta
        resolve(respuestaWS);

      })
      .catch( error => {
        console.log("ERROR ==> " + JSON.stringify(error.json()));
        reject(error.json());
      });
  })
}
 
  
ImprimirTicket(){
  //Mensaje de Confirmacion del Pago
  let confirm = this.alertCtrl.create({
    title: 'Atención',
    message: 'RECIBO # 123 ¿Esta seguró que desea Imprimir?',
    buttons: [
      {
        text: 'Si',
        handler: () => {
          this.printProvider.enviarImpresionTicket("Pruebas DMSA - IFLORES\n");
        }
      },
      { text: 'No',  handler: () => { console.log('No selected!'); } }
    ]
  });
  confirm.present();
}


  /*
  //Salir del Aplicativo
  salirApp(){
    //Mensaje de Confirmacion del Pago
    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: '¿Está seguro que desea salir del Sistema de Cobranzas?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('Yes selected'); 
            //this.platform.exitApp();          
          }
        },
        {
          text: 'No', 
          handler: () => {
            console.log('No selected!');
          }
        }
      ]
    });
    confirm.present();
  }
*/
  
  /*pushPage(){
    this.navCtrl.push("DetailPage");
  }*/

  /*ionViewCanLeave(){
    //your code;
    let alert = this.alertCtrl.create({
      title: 'Atención',
      subTitle: 'Esta intentando salir de la Aplicación - Por favor Presionar salir desde el menu principal.',
      buttons: ["Aceptar"]
    });
    alert.present();
    return false;
  }*/

  ionViewDidLoad(){//ionViewDidEnter(){
    //Si no esta sincronizado lo realiza al inicio del Dia
    /*console.log("SINCRONIZADO ==> "+this.beanSeguridad.SINCRONIZADO);
    if(!this.beanSeguridad.SINCRONIZADO){
      console.log("Llamado - sincronizacionInformacionAPP");
      this.sincronizacionInformacionAPP();
    }*/
  }

  /*
  ionViewWillUnload(){
    //your code;
    console.log('ionViewWillUnload');
    this.salirApp();
  }*/

}
