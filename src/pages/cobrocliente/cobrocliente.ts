import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';

/**
 * Generated class for the CobroclientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cobrocliente',
  templateUrl: 'cobrocliente.html'
})
export class CobroclientePage {

  //Variables Manejan todo el Formulario
  isFormasPago:boolean = false;
  isDocumentos:boolean = false;
  
  //Registro Data Visualizacion para Formas Pago
  myModalDataFP:any = { iddetalle:0, 
                        idformapago: 'EF', 
                        descformapago: 'EFECTIVO',  
                        idbanco: '',  
                        descbanco: '',  
                        idtarjeta: '', 
                        desctarjeta: '',  
                        numero_cheque: '', 
                        cta_cheque: '',  
                        idctacia: '',    
                        descctacia: '',  
                        numerodeposito: '',  
                        iddocumento: '',    //descdocumento: '',  
                        emisor: '',  
                        tipocheque: '',
                        fcobrocheque: '',
                        idindicador: '',   
                        descindicador: '',  
                        numero_lote: '',  
                        numero_tarjeta: '',  
                        numero_retencion: '',  
                        valor: '' };

  //Registro Data Visualizacion para Documentos
  myModalDataDocumentos:any = { iddetalle:0, 
                            idformapago: '', 
                            descformapago: '',  
                            idbanco: '',  
                            descbanco: '',  
                            idtarjeta: '', 
                            desctarjeta: '',  
                            numero_cheque: '', 
                            cta_cheque: '',  
                            idctacia: '',    
                            descctacia: '',  
                            numerodeposito: '',  
                            iddocumento: '',    //descdocumento: '',  
                            emisor: '',  
                            tipocheque: '',
                            fcobrocheque: '',
                            idindicador: '',   
                            descindicador: '',  
                            numero_lote: '',  
                            numero_tarjeta: '',  
                            numero_retencion: '',  
                            valor: '' };

  listaFormasPago:any = {data:[]}; 
  listaDocumentos:any = {data:[]};
  TOTAL_FPAGOS:string = "0.00";
  TOTAL_APLICAR:string = "0.00";
  //************************************

  idRecibo = null;
  filtro_empresa = null;
  nombre_empresa = null;
  filtro_cliente = null;
  codigo_cliente = null;
  nombre_cliente = null;
  //SECUENCIARECIBO:string  = "0";
  titulo_opcion = null;
  isNuevo:boolean  = false;
 
  //selectedItem: any;
  items: Array<{id: string,
                titulo: string, 
                titulo1:string, 
                b1: string, 
                b2: string, 
                b3: string, 
                b4:string, 
                b5:string,
                b6: string,
                b7: string,
                v1: string, 
                v2: string, 
                v3: string, 
                v4:string, 
                v5:string,
                v6: string,
                v7: string,
                isBloqueado: string }>; 
                
  fdesde: any;
  fhasta: any;
  title: string;

  

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public alertCtrl: AlertController,
              public tasksService: TasksServiceProvider,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController,
              private modal: ModalController) {

      console.log("CobroclientePage...."); 
      console.log("CobroclientePage ID...."+navParams.get('ID')); 
            
      this.filtro_empresa = navParams.get('empresa');
      this.nombre_empresa = navParams.get('nombre_empresa');
      this.isNuevo = navParams.get('nuevo') == 'S'; 
       if(this.isNuevo){
        this.filtro_cliente = navParams.get('cliente');
        this.codigo_cliente = this.filtro_cliente.split('-')[0].trim();
        this.nombre_cliente = this.filtro_cliente.split('-')[1].trim();
        this.titulo_opcion = "Nuevo Cobro / "+this.nombre_empresa; 
        this.idRecibo = "0"; //No tiene ID asignado       
      }else{
        this.filtro_cliente = navParams.get('CODCLIENTE').trim()+"-"+navParams.get('NOMBRECLIENTE').trim();
        this.codigo_cliente = navParams.get('CODCLIENTE').trim();
        this.nombre_cliente = navParams.get('NOMBRECLIENTE').trim();
        this.titulo_opcion = navParams.get('IDRECIBO').trim()+ " / "+this.nombre_empresa;
        this.idRecibo = navParams.get('ID').trim(); //Tiene ID asignado (ROWID)    
      }   

      //Inicializa la Informacion
      this.inicializarComponentes();
  }

  inicializarComponentes() {
     //Iniciar con Formas de Pago Cargados
     this.listaDocumentos.data = [];
     let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
     loading.present()
     .then(() =>{ 
         //Obteniendo Informacion
         this.tasksService.obtenerEstadoCuentaXCliente({empresa:this.filtro_empresa, cliente:this.codigo_cliente, soloFacturas:'N'})
         .then(data => {
           if(data.length > 0){
            this.listaDocumentos.data = data;
           }
         });
     })/*
     .then(() =>{ 
        //Si es Nuevo - Obtiene la secuencia del Cobro
        if(this.isNuevo){
          let fechaActual = this.beanSeguridad.fechaActual().substring(0, 10);
          this.tasksService.obtenerSecuenciaRecibo(this.filtro_empresa, fechaActual, this.beanSeguridad.USUARIO_LOGONEADO)
          .then(data => {
            //console.log("data ==> "+JSON.stringify(data));
            this.SECUENCIARECIBO = this.beanSeguridad.USUARIO_LOGONEADO.substring(0,2).toUpperCase() +
                                   this.filtro_empresa + "-" +
                                   (fechaActual.replace(/-/gi,"")) + "-" + 
                                   ((data.length <= 0) ? 1 : (+data[0].SECUENCIA));
          });
        }
     })*/
     .then(() =>{ 
        //Si no es nuevo cargo las Variables para Edicion
        if(!this.isNuevo){
          var cadenaCobro = this.navParams.get('DETALLESPAGO');
          var cadenaDocumentos = this.navParams.get('DETALLESDOCU');
          //var idRecibo = this.navParams.get('idRecibo').trim();
          this.listaFormasPago.data = JSON.parse(cadenaCobro);
          this.listaDocumentos.data  = JSON.parse(cadenaDocumentos);
          //Para que aparezca aplicado los items
          //this.cargarListaDocumentos();
          //this.titulo_opcion = idRecibo+ " / "+this.nombre_empresa;
          //this.SECUENCIARECIBO = idRecibo; //(+idRecibo.substring(10,idRecibo.length)*1);
        }
      })
     .then(() =>{ 
       //Seteo como tab inicial Las Formas de Pago
       this.cambioTab('FPAGO');

       //Cierra Espera
       loading.dismiss();   
     })
  }

  //************* CAMBIO DE TAB ***************** 
  cambioTab(TIPO:string){

    //Si se presiona Formas de Pago
    if(TIPO == 'FPAGO'){
      //Cambio Colores Botones
      this.isFormasPago = true;
      this.isDocumentos = false;

      //Cargar Informacion por Bloque
      this.cargarListaFormasPago();
    }

    //Si se presiona Documentos
    if(TIPO == 'APDOC'){
      //Cambio Colores Botones
      this.isFormasPago = false;
      this.isDocumentos = true

      //Cargar Informacion por Bloque
      this.cargarListaDocumentos();
    }

  }
  //***********************************************


  //Cargar Lsitado de Documentos segun la Pestaña Seleccionada
  cargarListaFormasPago() {
    console.log("cargarListaDocumentos...");
    if(!this.isFormasPago){
      return;
    }

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present()
    .then(() =>{ 
        //Obtengo la Informacion Requerida
        this.items = [];
        let data = this.listaFormasPago.data;

        //Carga Formas de Pago
        var TotalFP = 0;
        for (let i = 0; i < data.length; i++) {
          //Inserta el Registroa a Pantalla
          data[i].iddetalle = ""+(i+1);
          this.items.push({id: JSON.stringify(data[i]),
                            titulo: data[i].idformapago+"-"+data[i].descformapago, 
                            titulo1: parseFloat(data[i].valor.replace(",","")).toFixed(2), 
                            b1: '', 
                            b2: '', 
                            b3: '', 
                            b4: '', 
                            b5: '',
                            b6: '',
                            b7: '',
                            v1: '', 
                            v2: '', 
                            v3: '', 
                            v4: '', 
                            v5: '',
                            v6: '',
                            v7: '',
                            isBloqueado: 'N'});

            TotalFP = TotalFP + (+data[i].valor);            
        }             
        //Respaldo para la Busqueda por Filtro
        this.TOTAL_FPAGOS = ""+TotalFP;

        //Cierra Espera
         loading.dismiss();
    });    
}

//Realiza la Busqueda de Clientes 
cargarListaDocumentos() {
  console.log("buscarDocumentosAplicados..."+JSON.stringify(this.listaDocumentos.data));    
  if(!this.isDocumentos){
    return;
  }

  //Si existen valores por Aplicar
  let aplicar = (+this.TOTAL_FPAGOS) * 1 > 0;
  //if(aplicar){  this.listaDocumentos.data = []; }   

  let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
  loading.present()
  .then(() =>{ 
      //Obtengo la Informacion Requerida
      this.items = [];
      let data = this.listaDocumentos.data; 

      //Carga de los registros
      var valorTotalFormasPago = (+this.TOTAL_FPAGOS) * 1;
      var valorTotalAplicado = 0;
      var valorFaltaAplicar = 0;
      var valorSaldoDocumento = 0;
      var valorAplicaDocumento = 0;

      this.listaDocumentos.data = [];
      for (let i = 0; i < data.length; i++) {
        
        //Aplicacion de las Fomas de Pago
        if(aplicar){
          //si el registro esta bloqueado por edicion
          if(data[i].BLOQUEADO.trim() == "S"){
            valorAplicaDocumento = +parseFloat(""+data[i].VALORXAPLICAR.replace(",","")).toFixed(2) * 1;
            valorTotalAplicado = valorTotalAplicado + valorAplicaDocumento;
          }
          else{
            //Aplico el Valor al Saldo
            valorFaltaAplicar = +(valorTotalFormasPago - valorTotalAplicado).toFixed(2) * 1;
            if(valorFaltaAplicar > 0){
              valorSaldoDocumento = (+parseFloat(""+data[i].VALORSALDO.replace(",","")).toFixed(2) - +parseFloat(""+data[i].VALORCHEQUE.replace(",","")).toFixed(2)) * 1 ;
              valorAplicaDocumento = ((valorFaltaAplicar < valorSaldoDocumento)?valorFaltaAplicar:valorSaldoDocumento);

              data[i].VALORXAPLICAR = ""+valorAplicaDocumento;
              valorTotalAplicado = valorTotalAplicado + valorAplicaDocumento;
            }else{
              data[i].VALORXAPLICAR = "0.00";
              data[i].BLOQUEADO = "N";
            }
          }
        }

        //Inserta el Registroa a Pantalla
        this.items.push({id: JSON.stringify(data[i]),
                        titulo: data[i].NUMDOCUMENTO, 
                        titulo1: data[i].VALORCUOTA, 
                        b1: 'FECHA:', 
                        b2: 'DIAS-FE:', 
                        b3: 'Referencia:', 
                        b4: 'CH-POSF:', 
                        b5: 'SALDO:',
                        b6: 'ABONO',
                        b7: 'VEND:',
                        v1: data[i].FECHAEMISION, 
                        v2: '(DIAS: '+data[i].DIASFEMISION+')', 
                        v3: data[i].REFERENCIA, 
                        v4: ("0.00" == data[i].VALORCHEQUE ? "-" : "$ "+data[i].VALORCHEQUE), 
                        v5: "$ "+ parseFloat(data[i].VALORSALDO.replace(",","")).toFixed(2),
                        v6: "$ "+ parseFloat(data[i].VALORXAPLICAR.replace(",","")).toFixed(2),
                        v7: data[i].VENDEDOR,
                        isBloqueado: data[i].BLOQUEADO
                      });

        //Ingreso a la lista los registros modificados
        this.listaDocumentos.data.push(data[i]);
      }    
      
      //Respaldo para la Busqueda por Filtro
      this.TOTAL_APLICAR = ""+valorTotalAplicado; 

      //Cierra Espera
      loading.dismiss();      
  });    
}

aplicarPagoDocumentos(){
  this.cargarListaDocumentos();
}

//******** LLAMA A PANTALLA PARA NUEVA FORMA DE PAGO ********
abrirNuevaFormaPago(cadenaFP:any) {
  console.log("abrirNuevaFormaPago..."+JSON.stringify(cadenaFP));
  let myModalData = (cadenaFP != null) ? cadenaFP : this.myModalDataFP;
  const myModalOptions: ModalOptions = { enableBackdropDismiss: false };
  const myModal: Modal = this.modal.create('FormaspagoPage', {data: myModalData, empresa:this.filtro_empresa}, myModalOptions);
  myModal.present();

  //Ingreso/Actualizacion de las FPago
  myModal.onDidDismiss((data) => {
    if(data != null){
      console.log("Lista Recibido ==> "+JSON.stringify(data));
      if((+data.iddetalle) != 0){
        let listaFP = this.listaFormasPago.data;
        this.listaFormasPago.data = [];
        for (let i = 0; i < listaFP.length; i++) {
          if(data.iddetalle == listaFP[i].iddetalle){
            this.listaFormasPago.data.push(data);
          }else{
            this.listaFormasPago.data.push(listaFP[i]);
          }
        }
      }
      else{
        data.iddetalle = ""+(this.listaFormasPago.data.length+1);
        this.listaFormasPago.data.push(data);
      }
      this.cargarListaFormasPago();
    }
  });

  myModal.onWillDismiss((data) => {
    console.log("I'm about to dismiss");
    console.log(JSON.stringify(data));
    //
  });
}

/**** PROCESO ELIMINA FPAGO PANTALLA */
eliminarFormaPago(cadenaFP:any) {
  console.log("eliminarFormaPago..."+JSON.stringify(cadenaFP));
  let data = this.listaFormasPago.data;
  this.listaFormasPago.data = [];
  for (let i = 0; i < data.length; i++) {
    if(cadenaFP.iddetalle != data[i].iddetalle){
      this.listaFormasPago.data.push(data[i]);
    }
  }
  this.cargarListaFormasPago();
}

//Enlaza a la Pantalla de Visualizacion de Saldos
eliminarPago(item){
    //Mensaje de Confirmacion del Pago
    let confirm = this.alertCtrl.create({
    title: 'Atención',
    message: '¿Está Seguro que desea Eliminar el Pago?',
    buttons: [
      {
        text: 'Si',
        handler: () => {
          console.log('Yes selected');
          this.eliminarFormaPago(JSON.parse(item.id));
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

//Enlaza a la pantalla de Pagos Nuevos
modificarPago(item){    
  //Cargar Forma de Pago
  this.abrirNuevaFormaPago(JSON.parse(item.id));      
}

//Guardar el Cobro 
guardarCobro(){

  //Validaciones
  let totalFormasPago  = +parseFloat(this.TOTAL_FPAGOS.replace(",","")).toFixed(2) * 1;
  let totalDocumentos  = +parseFloat(this.TOTAL_APLICAR.replace(",","")).toFixed(2) * 1;
  if(totalDocumentos > totalFormasPago){
    let alert = this.alertCtrl.create({
      title: 'Atención',
      subTitle: 'Error ==> El valor Total Aplicado no puede ser mayor al Total del Pago.',
      buttons: ["Aceptar"]
    });
    alert.present(); 
    return;
  }

  if(totalFormasPago <= 0){
    let alert = this.alertCtrl.create({
      title: 'Atención',
      subTitle: 'Error ==> No se puede guardar un Recibo de cobro sin Formas de Pago asignadas.',
      buttons: ["Aceptar"]
    });
    alert.present(); 
    return;
  }

  let loading = this.loadingCtrl.create({ content: 'Validando Información... <br><b>Por favor espere...</b>' });
  loading.present();

  //Validacion de guardado TOTAL APLICADO <= TOTAL FP  
  var valorTotalFormasPago = (+this.TOTAL_FPAGOS) * 1;
  var valorTotalAplicado = 0;
  var listaAplicados = [];
  let detallesDocumentos = this.listaDocumentos.data; 
  for (let i = 0; i < detallesDocumentos.length; i++) {
    //Si tiene un valor aplicado se considera
    if((+detallesDocumentos[i].VALORXAPLICAR) > 0){
      valorTotalAplicado = valorTotalAplicado + (+detallesDocumentos[i].VALORXAPLICAR);
      listaAplicados.push(detallesDocumentos[i]);
    }
  }
            
  //Cierra Espera
  loading.dismiss();
        
  
  console.log("guardarCobro ==> ");
  //Mensaje de Confirmacion del Pago
  let confirm = this.alertCtrl.create({
  title: 'Atención',
  message: (listaAplicados.length <= 0?" <b>OJO: NO EXISTEN DOCUMENTOS ASIGNADOS AL PAGO</b><br>":"")+'¿Está Seguro que desea Guardar los Cambios?',
  buttons: [
    {
      text: 'Si',
      handler: () => {
        /************ GUARDADO  **************/
        //console.log('Yes selected');
        var registroCobro = {
          ID:this.idRecibo,
          CODEMPRESA: this.filtro_empresa,
          IDRECIBO: (this.isNuevo?"-":this.idRecibo.toUpperCase()),
          FECHA:''+this.beanSeguridad.fechaActual().substring(0, 10),
          CODUSUARIO: this.beanSeguridad.USUARIO_LOGONEADO,
          CODCLIENTE:this.codigo_cliente,
          NOMBRECLIENTE:this.nombre_cliente,
          VALORPAGO: +valorTotalFormasPago.toFixed(2) * 1, //valorTotalFormasPago,
          DETALLESPAGO: JSON.stringify(this.listaFormasPago.data),
          DETALLESDOCU: JSON.stringify(listaAplicados),
          CODESTADO: 'ACTIVO'
        };

        //Ejecuto Guardado de los cambios
        if(!this.isNuevo){
          // *** Actualizar Registro ************
          this.tasksService.actualizarCobros(registroCobro)
          .then(response => {
            console.log("guardado Exitoso"); 
            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: 'Recibo Modificado Exitosamente.', //'+this.SECUENCIARECIBO+'
              buttons: ["Aceptar"]
            });
            alert.present();        
          })
          .catch( error => {
            console.error( error );
          });
          //*************************************

          //Retorno Pagina Anterior
          this.navCtrl.pop();
        }
        else{
          // *** Insertar Registro ************
          this.tasksService.insertarRegistros(this.tasksService.TABLA_COBRECIBOCAB, registroCobro)
          .then(response => {
            console.log("guardado Exitoso"); 
            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: 'Recibo Guardado Exitosamente.', //'+this.SECUENCIARECIBO+'
              buttons: ["Aceptar"]
            });
            alert.present();        
          })
          .catch( error => {
            console.error( error );
          });
          //*************************************

          //Retorno a Pantalla Principal de Cobranzas
          this.navCtrl.pop();
          this.navCtrl.pop();
          //this.navCtrl.setRoot(PrincipalcobranzaPage); 
          //this.navCtrl.popToRoot();
        }
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

salirCobro(){
  let confirm = this.alertCtrl.create({
    title: 'Atención',
    message: 'Cualquier cambio no guardado se perderá ¿Está Seguro que desea Salir?',
    buttons: [
      {
        text: 'Si',
        handler: () => {
          this.navCtrl.pop();
          //if(!this.isNuevo){ } else{ }
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

/** EDITA EL VALOR DE ABONO */
editarAbono(item:any){
  console.log("editarAbono ==> "+item.id);
  var cadenaDocumento = JSON.parse(item.id);
  //Validaciones Generales
  let totalFormasPago  = +parseFloat(this.TOTAL_FPAGOS.replace(",","")).toFixed(2) * 1;
  let saldoDocumento  = +parseFloat(cadenaDocumento.VALORSALDO.replace(",","")).toFixed(2) * 1;
  let valorXAplicar  = +parseFloat(cadenaDocumento.VALORXAPLICAR.replace(",","")).toFixed(2) * 1;

  if(totalFormasPago <= 0){
    let alert = this.alertCtrl.create({
      title: 'Atención',
      subTitle: 'El total de las Formas de Pago es $0.00 no se puede asignar valor de abono.',
      buttons: ["Aceptar"]
    });
    alert.present();  
    return;
  }

  if(valorXAplicar <= 0){
    let alert = this.alertCtrl.create({
      title: 'Atención',
      subTitle: 'El valor aplicado al Documento es $0.00 por tanto no se puede modificar.',
      buttons: ["Aceptar"]
    });
    alert.present();  
    return;
  }

  //Pantalla de Modificacion del Abono
  let alert = this.alertCtrl.create({
    title: 'ABONO',
    inputs: [ {  name: 'valor', placeholder: cadenaDocumento.VALORXAPLICAR, type: 'number' } ],
    buttons: [
      {
        text: 'Aplicar',
        handler: data => {
          console.log('Aplicar clicked');          
          
          if( +data.valor > saldoDocumento){
            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: 'Error ==> El Valor no puede ser mayor al Saldo del Documento: $'+saldoDocumento,
              buttons: ["Aceptar"]
            });
            alert.present();  
            return false;
          }

          //Actualiza Valores en la Lista        
          let detallesDocumentos = this.listaDocumentos.data; 
          this.listaDocumentos.data = [];
          for (let i = 0; i < detallesDocumentos.length; i++) {
            if(detallesDocumentos[i].REFERENCIA ==  cadenaDocumento.REFERENCIA){
              detallesDocumentos[i].VALORXAPLICAR = ""+(+parseFloat(data.valor.replace(",","")).toFixed(2) * 1); //data.valor 
              detallesDocumentos[i].BLOQUEADO = "S";              
            }
            this.listaDocumentos.data.push(detallesDocumentos[i]);
          }
          this.cargarListaDocumentos();

        }
      },
      {
        text: 'Cerrar',
        //role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      
    ]
  });
  alert.present();

}

//Para liberar Bloqueo por Edicion
liberarBloqueo(item:any){
  console.log("liberarBloqueo ==> "+item.id);
  var cadenaDocumento = JSON.parse(item.id);

  let confirm = this.alertCtrl.create({
    title: 'Atención',
    message: '¿Está Seguro que desea liberar los Cambios en el Documento?',
    buttons: [
      {
        text: 'Si',
        handler: () => {        
          //Actualiza Valores en la Lista        
          let detallesDocumentos = this.listaDocumentos.data; 
          this.listaDocumentos.data = [];
          for (let i = 0; i < detallesDocumentos.length; i++) {
            if(detallesDocumentos[i].REFERENCIA ==  cadenaDocumento.REFERENCIA){ 
              detallesDocumentos[i].BLOQUEADO = "N";              
            }
            this.listaDocumentos.data.push(detallesDocumentos[i]);
          }
          this.cargarListaDocumentos();
          /*************************************/
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

//ionViewDidLoad()
ionViewWillLoad(){
  //this.inicializarComponentes();
  console.log('ionViewDidLoad CobroclientePage');
}


}
