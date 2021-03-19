import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { NotasdecreditoPage } from "../notasdecredito/notasdecredito";
import { SaldonotascreditoPage } from "../saldonotascredito/saldonotascredito";
/**
 * Generated class for the PrincipalnotasdecreditoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principalnotasdecredito',
  templateUrl: 'principalnotasdecredito.html',
})
export class PrincipalnotasdecreditoPage {

  listaEmpresas:any;
  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;
  empresas: Array<{ value: string, text: string }> = [];

  icons: string[];
  items: Array<{id:string,
    title: string,
    note: string,
    estado:string,
    isEditar:boolean,
    isConfirmar:boolean,
    isEliminar:boolean,
    isEnviar:boolean,
    isReversar:boolean,
    isImprimir:boolean,
    isCerrado:boolean,
    isVerTicket:boolean,
    cierre:boolean
  }>;

  itemsRespaldo: Array<{id:string,
    title: string,
    note: string,
    estado:string,
    isEditar:boolean,
    isConfirmar:boolean,
    isEliminar:boolean,
    isEnviar:boolean,
    isReversar:boolean,
    isImprimir:boolean,
    isCerrado:boolean,
    isVerTicket:boolean,
    cierre:boolean
  }>;
  fdesde: any;
  fhasta: any;
  empresa: any;
  nombre_empresa:any;
  displayProperty: string;
  title: string;
  /*** FORMAS DE PAGO GENERALES ***/
  FP_EFECTIVO:string  = "EF";
  FP_CHEQUE:string   = "CH";
  FP_DEPOSITO:string   = "DP";
  //FP_DEPOSITOXCONFIRMAR:string  = "DPPC";
  FP_TARJETA:string  = "TJ";
  //FP_TARJETAXCONFIRMAR:string  = "TJPC";
  FP_NOTACREDITO:string  = "NC";
  //FP_PAYPHONE:string  = "TJPP";
  //FP_RETENCIONBANCARIA:string  = "RETBAN";
  FP_TRANSFERENCIABANCARIA:string  = "TRANBAN";
  FP_RETENCIONFUENTE:string  = "RF";

  constructor(public navCtrl: ViewController,
              public navCtrl_Pages: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController,
              public tasksService: TasksServiceProvider,
              private modal: ModalController) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.displayProperty = navParams.get('displayProperty');
    //this.title = navParams.get('title');
    //if(!this.title) this.title = 'Select...';

    this.fdesde = this.beanSeguridad.fechaActual().substring(0,10);
    this.fhasta = this.beanSeguridad.fechaActual().substring(0,10);

    //********** Obtencion de las Empresas *********************
    this.empresa = null;
    this.listaEmpresas = JSON.parse(beanSeguridad.EMPRESAS);
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      //console.log("empresa ==> "+listaEmpresas[i].empresa+" nombre ==> "+listaEmpresas[i].nombre);
      this.empresas.push({value: this.listaEmpresas[i].empresa, text: this.listaEmpresas[i].nombre});
      //Asigna la primera empresa
      if(this.empresa == null){
        this.empresa = this.listaEmpresas[i].empresa;
        this.nombre_empresa = this.listaEmpresas[i].nombre;
      }
    }
    //*********************************************************

    //Cargar Informacion Inicial
    this.obtenerInformacionNC();
  }
  onSelectChange(item:any, tipo:string) {
    if(tipo == "EMP"){
      console.log("onSelectChange-->"+item.text.trim());
      this.empresa = item.value.trim();
      this.nombre_empresa = item.text.trim();
    }

    //Re-leer el Grid Principal
    this.obtenerInformacionNC();
  }
  obtenerInformacionNC(){

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present()
      .then(() =>{
        //Obtengo la Informacion Requerida
        this.items = [];
        this.tasksService.obtenerSolicitudNotaCredito(this.empresa, this.fdesde.substring(0,10), this.fhasta.substring(0,10), this.beanSeguridad.USUARIO_LOGONEADO)
          .then(data => {
            //Botones
            let isEditar:boolean = false;
            let isConfirmar:boolean = false;
            let isEliminar:boolean = false;
            let isEnviar:boolean = false;
            let isReversar:boolean = false;
            let isImprimir:boolean = false;
            let isVerTicket:boolean = false;

            var list  = data;
            this.items = [];
            console.log("DATOSNC ==> " + JSON.stringify( data));
            var lastDate = '1979-01-01';
            for (let i = 0; i < list.length; i++) {
              if(list[i].FECHA != lastDate) {
                //REGISTRO DE CIERRE
                console.log("VALIDA FECHA ==> " + JSON.stringify( list[i]));
                this.items.push({id:list[i].FECHA, //Guarda como ID la Fecha
                  title:list[i].FECHA,
                  note: '',
                  estado:'',
                  isEditar:false,
                  isConfirmar:false,
                  isEliminar:false,
                  isEnviar:false,
                  isReversar:false,
                  isImprimir:false,
                  isCerrado: true,
                  isVerTicket:false,
                  cierre:true});

                lastDate = list[i].FECHA;
              }

              //Validacion de Botones por Estado
              isEditar = false;
              isConfirmar = false;
              isEliminar = false;
              isEnviar  = false;
              isReversar = this.beanSeguridad.isAMBIENTE_PROD?false:true;
              isImprimir = false;
              isVerTicket = false;

              if(list[i].CODESTADO == 'ACTIVO'){
                isEditar = true;
                isConfirmar = true;
                isEliminar = true;
                isVerTicket = true;
              }else if(list[i].CODESTADO == 'CONFIRMADO'){
                isEnviar  = true;
                isImprimir = true;
              }else if(list[i].CODESTADO == 'ANULADO'){
                isVerTicket = true;
              }else{
                isImprimir = true;
              }

              //REGISTRO DE COBRO
              console.log("InsertaPantalla"+JSON.stringify(list[i]));
              this.items.push({id:JSON.stringify(list[i]),
                title:list[i].CLIENTE,
                note: "TK: "+(list[i].IDNOTACREDITO!=null?list[i].IDNOTACREDITO:list[i].ID)+" - ",//+list[i].IDRECIBO.toUpperCase() +" • $ " + this.formatNumber(list[i].VALORPAGO,2) +" • ",
                estado: list[i].CODESTADO,
                isEditar:isEditar,
                isConfirmar:isConfirmar,
                isEliminar:isEliminar,
                isEnviar:isEnviar,
                isReversar:isReversar,
                isImprimir:isImprimir,
                isCerrado:true,
                isVerTicket:isVerTicket,
                cierre:false});
            }

            //Respaldo para la Busqueda por Filtro
            this.itemsRespaldo = this.items;
            console.log("CADENASALIDA ==> " + JSON.stringify(this.items));


            //Cierra Espera
            loading.dismiss();
          })
          .catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));

            //Cierra Espera
            loading.dismiss();
          });
      });

  }//ObtenerInformacionNC


  formatNumber(valor:any, decimales:number){
    return new Intl.NumberFormat('en-us', {minimumFractionDigits: decimales}).format(valor);
  }

  pad(texto:string, bloque:number, alinear:string){
    texto = texto.trim();
    let s = texto.length > bloque ? texto.substring(0,bloque) : texto;
    if("C" == alinear){
      bloque = ((bloque - texto.length) / 2)+texto.length;
      console.log("bloque ==> "+bloque);
    }
    while (s.length < bloque){
      s = ("L" == alinear) ? s + " ":" "+s;
    }
    return s;
  }
  //Envia a Pantalla de Nueva Cobranza
  nuevaNotaCredito(){
    //Lista Recorridos
    //09032021 quito esto para tomar los parametros de la empresa seleccionada
    /*let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == this.empresa){
        infoEmpresa = this.listaEmpresas[i];
      }
    }*/

    //let parametros = {empresa:infoEmpresa.empresa, nombre_empresa: infoEmpresa.nombre};
    let parametros = {empresa:this.empresa, nombre_empresa: this.nombre_empresa};
    console.log("PARAMETROSNotasdecreditoPage...."+parametros.nombre_empresa);
    this.navCtrl_Pages.push(NotasdecreditoPage,parametros);
  }


  //Imprimir nota de credito
  imprimirNC(item:any, habilitaImprimir:string){

    console.log("imprimirNotacredito...."+JSON.stringify(item));

    var re = /#/gi;
    var entidadnc = JSON.parse(item.id.replace(re,''));

    console.log("ENTIDAD-->"+JSON.stringify(entidadnc));

    var detallesnotacre = JSON.parse(entidadnc.DETALLESNC);

    console.log("DETALLE-->"+JSON.stringify(detallesnotacre));

    var textoImprimir = "";

    //Nombre Empresa
    //Lista Recorridos
    let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == entidadnc.CODEMPRESA){
        infoEmpresa = this.listaEmpresas[i];
      }
    }

    //Cabecera Impresion
    textoImprimir = textoImprimir + this.pad(infoEmpresa.nombre,32,"C")+"\n";
    //textoImprimir = textoImprimir + this.pad("SOL. NOTA DE CREDITO #"+entidadnc.IDNOTACREDITO,32,"C")+"\n";
    textoImprimir = textoImprimir + "=== SOLICITUD DE NOTA DE CREDITO ===\n";
    textoImprimir = textoImprimir + "Cliente: ("+entidadnc.CLIENTE.split('-')[0].trim()+") "+entidadnc.CLIENTE.split('-')[1].trim()+"\n\n";

    textoImprimir = textoImprimir + ".______________________________.\n";
    textoImprimir = textoImprimir + "| ESTE TICKET ES INFORMATIVO.**|\n";
    textoImprimir = textoImprimir + "| LA SOLICITUD SERA EVALUADA   |\n";
    textoImprimir = textoImprimir + "| PARA SU APROBACION.**********|\n";
    textoImprimir = textoImprimir + ".______________________________.\n\n";

    //Documentos Aplicados
    textoImprimir = textoImprimir + "=========== DETALLE ===========\n";

    for (let i = 0; i < detallesnotacre.length; i++) {
      textoImprimir = textoImprimir + this.pad(detallesnotacre[i].NUMDOCUMENTO,32,"L")+"\n";
      textoImprimir = textoImprimir + " "+"ARTICULO: "+detallesnotacre[i].ARTICULO+"\n";
      textoImprimir = textoImprimir + " "+this.pad("Cantidad devuelve: "+this.formatNumber(detallesnotacre[i].CANTIDADDEVUELTA,0),31,"L")+"\n";
      textoImprimir = textoImprimir + "_____________________________\n";
    }

    //Pie Impresión
    textoImprimir = textoImprimir + "\n\n================================\n";
    textoImprimir = textoImprimir + "Cod. Vnd: "+entidadnc.CODUSUARIO+"\n";
    textoImprimir = textoImprimir + "Fecha: "+entidadnc.FECHA+"\n";
    textoImprimir = textoImprimir + "\n\n________________________________\n";
    textoImprimir = textoImprimir + this.pad("-Firma Cliente-",32,"C")+"\n\n";

    //Envio a Pantalla Externa
    const myModalOptions: ModalOptions = { enableBackdropDismiss: false };
    const myModal: Modal = this.modal.create('ImprimirPage', {data:[], texto:textoImprimir, imprimir:habilitaImprimir}, myModalOptions);
    myModal.present();

  }


  //Editar Cobro
  editarNC(item:any){
    console.log("editarNotacredito...."+JSON.stringify(item));
    //Obtengo la Informacion Requerida

    var re = /#/gi;
    var entidadnc = JSON.parse(item.id.replace(re,''));

    console.log("ENTIDAD-->"+JSON.stringify(entidadnc));

    var detallesnotacre = JSON.parse(entidadnc.DETALLESNC);

    console.log("DETALLE-->"+JSON.stringify(detallesnotacre));

    let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == entidadnc.CODEMPRESA){
        infoEmpresa = this.listaEmpresas[i];
      }
    }

    //Abre la Pantalla de Edicion
    entidadnc.empresa = infoEmpresa.empresa;
    entidadnc.nombre_empresa = infoEmpresa.nombre;
    entidadnc.nuevo = 'N';

    console.log("ENVIOEDITAR...."+JSON.stringify(entidadnc));
    let parametros = JSON.stringify(entidadnc);
    this.navCtrl_Pages.push(SaldonotascreditoPage,entidadnc);
  }

  //Reversar Cobro
  reversarCobro(item:any){
    this.actualizarCobro(item, "REV");
  }

  //Confirmar Cobro
  confirmarCobro(item:any){
    //INTENTA EL ENVIO DEL COBRO
    this.actualizarCobro(item, "CONF");
    /*try {
      this.enviarCobro(item);
    } catch (error) {
      console.log("ERROR ==> " + JSON.stringify(error.json()));
      this.actualizarCobro(item, "CONF");
    }*/
  }
  /*----------------------------------------------------------------------------*/
  //Confirmar Nota de credito
  confirmarNC(item:any){
    this.actualizarNC(item, "CONF");
    /*try {
      this.enviarCobro(item);
    } catch (error) {
      console.log("ERROR ==> " + JSON.stringify(error.json()));
      this.actualizarCobro(item, "CONF");
    }*/
  }




  //Enviar Nota Credito
   enviarNC(item:any, SECUENCIARECIBO:string){
    //console.log("enviar nota de credito....");
    //console.log(JSON.stringify(item));
    //Obtengo la Informacion Requerida
     console.log("EnvioNC 1");
    var re = /#/gi;
    var entidadnc = JSON.parse(item.id.replace(re,''));
    //console.log("ENTIDAD-->"+JSON.stringify(entidadnc));
    var detallesnotacre = JSON.parse(entidadnc.DETALLESNC);
    console.log("DETALLE-->"+JSON.stringify(detallesnotacre));
    let parametroWS:any;
    let respuestaWS:any;
    let loading = this.loadingCtrl.create({ content: 'Enviando Información... <br><b>Por favor espere...</b>' });
    loading.present();
    return new Promise((resolve, reject) => {
                                                      parametroWS = { codEmpresa:       entidadnc.CODEMPRESA,
                                                                      tipoNotaCredito:  entidadnc.TIPONOTACREDITO.split('-')[0].trim(),
                                                                      fechanc:          entidadnc.FECHA,
                                                                      codusuario:       entidadnc.CODUSUARIO,
                                                                      codCliente:       entidadnc.CLIENTE.split('-')[0].trim(),
                                                                      observaciones:    entidadnc.OBSERVACIONES,
                                                                      detallesncaplicados: detallesnotacre }//JSON.stringify(detallesnotacre)}


      this.beanSeguridad.obtenerInformacionWS("GUARDAR_NOTACREDITO", parametroWS)
        .then(data => {
          respuestaWS = data;
          console.log("respuestaMWB-->"+respuestaWS);

          if(respuestaWS.exito == "true"){
            console.log("EnvioNC 3");

            this.tasksService.cambiarEstadoNC(entidadnc.CODEMPRESA,entidadnc.ID, 'ENVIADO', respuestaWS.numcmprventa)
              .then(data => {
                //Cierra Espera
                loading.dismiss();

                //Mensaje Eliminado
                let alert = this.alertCtrl.create({
                  title: 'Atención',
                  subTitle: respuestaWS.mensaje,//'El Recibo '+registroCabecera.IDRECIBO.toUpperCase()+ " fue enviado con exito.",
                  buttons: ["Aceptar"]
                });
                alert.present();

                //Re-leer el Grid Principal
                console.log("EnvioNC 5");
                this.obtenerInformacionNC();

                //termina proceso
                resolve();

              })
              .catch( error => {
                console.log("ERROR ==> " + JSON.stringify(error.json()));
                //Cierra Espera
                loading.dismiss();
              });


          }else{
            //Cierra Espera
            loading.dismiss();

            //Mensaje Eliminado
            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: 'Error ==> '+respuestaWS.mensaje,
              buttons: ["Aceptar"]
            });
            alert.present();
          }


        })
        .catch( error => {
          //console.log("ERROR ==> " + JSON.stringify(error.json()));

          //Cierra Espera
          loading.dismiss();

          //Mensaje Eliminado
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'Error ==> '+JSON.stringify(error.json()),
            buttons: ["Aceptar"]
          });
          alert.present();

          reject(error.json());
        });
    });
  }



  //Confirmar NotaCredito
  actualizarCobro(item:any, tipo:string){
    console.log("Confirmar Nota de credito....");
    var entidadCobro = JSON.parse(item.id);

    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: "¿Está Seguro que desea "+(("REV" == tipo)?'Reversar':'Confirmar')+" la nota de credito?",
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('Yes selected');

            let loading = this.loadingCtrl.create({ content: 'Procesando... <br><b>Por favor espere...</b>' });
            loading.present()
              .then(() =>{
                this.items = [];

                let SECUENCIARECIBO = "";
                if("CONF" == tipo){

                  let fechaActual = this.beanSeguridad.fechaActual().substring(0, 10);
                  this.tasksService.obtenerSecuenciaRecibo(entidadCobro.CODEMPRESA, fechaActual, this.beanSeguridad.USUARIO_LOGONEADO)
                    .then(data => {
                      console.log("data ==> "+JSON.stringify(data));
                      SECUENCIARECIBO = this.beanSeguridad.USUARIO_LOGONEADO.substring(0,2).toUpperCase() +
                        entidadCobro.CODEMPRESA + "-" +
                        (fechaActual.replace(/-/gi,"")) + "-" +
                        ((data.length <= 0) ? 1 : (+data[0].SECUENCIA));

                      //Si se Confirma el Cobro se actualiza el IDRECIBO
                      this.tasksService.cambiarEstadoCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID,'CONFIRMADO', SECUENCIARECIBO.toUpperCase())
                        .then(data => {
                          //Cierra Espera
                          loading.dismiss();

                          //INTENTA EL ENVIO DEL COBRO
                          if("CONF" == tipo){
                            try {
                              this.enviarNC(item, SECUENCIARECIBO);
                            } catch (error) {
                              console.log("ERROR ==> " + JSON.stringify(error.json()));

                              //Mensaje Eliminado
                              let alert = this.alertCtrl.create({
                                title: 'Atención',
                                subTitle: 'El Recibo '+SECUENCIARECIBO.toUpperCase()+ " fue actualizado con exito.",
                                buttons: ["Aceptar"]
                              });
                              alert.present();
                            }
                          }

                          //Re-leer el Grid Principal
                          this.obtenerInformacionNC();
                        })
                        .catch( error => {
                          console.log("ERROR ==> " + JSON.stringify(error.json()));
                          //Cierra Espera
                          loading.dismiss();
                        });


                    });

                }else{

                  //Si se Confirma el Cobro se actualiza el IDRECIBO
                  this.tasksService.cambiarEstadoCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID, ("REV" == tipo)?'ACTIVO':'CONFIRMADO', null)
                    .then(data => {
                      //Cierra Espera
                      loading.dismiss();

                      //Mensaje Eliminado
                      let alert = this.alertCtrl.create({
                        title: 'Atención',
                        subTitle: 'El Recibo fue actualizado con exito.', //'+entidadCobro.IDRECIBO.toUpperCase()+ "
                        buttons: ["Aceptar"]
                      });
                      alert.present();

                      //Re-leer el Grid Principal
                      this.obtenerInformacionNC();
                    })
                    .catch( error => {
                      console.log("ERROR ==> " + JSON.stringify(error.json()));
                      //Cierra Espera
                      loading.dismiss();
                    });

                }
              });

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
  /**********************************************************************************************/

  actualizarNC(item:any, tipo:string){
    console.log("actualizarNC....");
    //Actualiza Estado del NC
    //Obtengo la Informacion Requerida
    var entidadCobro = JSON.parse(item.id);

    //Mensaje de Confirmacion del Pago
    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: "¿Está Seguro que desea "+(("REV" == tipo)?'Reversar':'Confirmar')+" la solicitud de nota de credito?", //entidadCobro.IDRECIBO.toUpperCase()
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('Yes selected');

            //Elimina el Cobro Realizado
            let loading = this.loadingCtrl.create({ content: 'Procesando... <br><b>Por favor espere...</b>' });
            loading.present()
              .then(() =>{
                this.items = [];

                let SECUENCIARECIBO = "";
                if("CONF" == tipo){

                  let fechaActual = this.beanSeguridad.fechaActual().substring(0, 10);
                  this.tasksService.obtenerSecuenciaRecibo(entidadCobro.CODEMPRESA, fechaActual, this.beanSeguridad.USUARIO_LOGONEADO)
                    .then(data => {
                      console.log("data ==> "+JSON.stringify(data));
                      SECUENCIARECIBO = this.beanSeguridad.USUARIO_LOGONEADO.substring(0,2).toUpperCase() +
                        entidadCobro.CODEMPRESA + "-" +
                        (fechaActual.replace(/-/gi,"")) + "-" +
                        ((data.length <= 0) ? 1 : (+data[0].SECUENCIA));

                      //Si se Confirma el Cobro se actualiza el IDRECIBO
                      this.tasksService.cambiarEstadoCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID,'CONFIRMADO', SECUENCIARECIBO.toUpperCase())
                        .then(data => {
                          //Cierra Espera
                          loading.dismiss();

                          //INTENTA EL ENVIO DEL COBRO
                          if("CONF" == tipo){
                            try {
                              this.enviarNC(item, SECUENCIARECIBO);
                            } catch (error) {
                              console.log("ERROR ==> " + JSON.stringify(error.json()));

                              //Mensaje Eliminado
                              let alert = this.alertCtrl.create({
                                title: 'Atención',
                                subTitle: 'La solicitud de nota de credito '+SECUENCIARECIBO.toUpperCase()+ " fue actualizado con exito.",
                                buttons: ["Aceptar"]
                              });
                              alert.present();
                            }
                          }

                          //Re-leer el Grid Principal
                          this.obtenerInformacionNC();
                        })
                        .catch( error => {
                          console.log("ERROR ==> " + JSON.stringify(error.json()));
                          //Cierra Espera
                          loading.dismiss();
                        });


                    });

                }else{

                  //Si se Confirma el Cobro se actualiza el IDRECIBO
                  this.tasksService.cambiarEstadoCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID, ("REV" == tipo)?'ACTIVO':'CONFIRMADO', null)
                    .then(data => {
                      //Cierra Espera
                      loading.dismiss();

                      //Mensaje Eliminado
                      let alert = this.alertCtrl.create({
                        title: 'Atención',
                        subTitle: 'Registro de nota de credito fue actualizado con exito.', //'+entidadCobro.IDRECIBO.toUpperCase()+ "
                        buttons: ["Aceptar"]
                      });
                      alert.present();

                      //Re-leer el Grid Principal
                      this.obtenerInformacionNC();
                    })
                    .catch( error => {
                      console.log("ERROR ==> " + JSON.stringify(error.json()));
                      //Cierra Espera
                      loading.dismiss();
                    });

                }
              });

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





  /**********************************************************************************************/

  //Eliminar Cobro
  eliminarNC(item:any){

    console.log("eliminarNotaCredito...."+JSON.stringify(item));
    //Obtengo la Informacion Requerida
    var entidadnc = JSON.parse(item.id);

    //Mensaje de Confirmacion del Pago
    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: "¿Está Seguro que desea Eliminar la nota de credito?", //"+entidadCobro.IDRECIBO+"
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('Yes selected');

            //Elimina el Cobro Realizado
            let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
            loading.present()
              .then(() =>{
                this.items = [];
                this.tasksService.eliminarRegNotaCredito(entidadnc.CODEMPRESA, entidadnc.ID)
                  .then(data => {
                    //Cierra Espera
                    loading.dismiss();

                    //Mensaje Eliminado
                    let alert = this.alertCtrl.create({
                      title: 'Atención',
                      subTitle: 'Registro de nota de credito fue eliminado con exito.',
                      buttons: ["Aceptar"]
                    });
                    alert.present();

                    //Re-leer el Grid Principal
                    this.obtenerInformacionNC();
                  })
                  .catch( error => {
                    console.log("ERROR ==> " + JSON.stringify(error.json()));
                    //Cierra Espera
                    loading.dismiss();
                  });
              });

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalnotasdecreditoPage');
  }

}
