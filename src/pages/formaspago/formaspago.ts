import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';

/**
 * Generated class for the FormaspagoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formaspago',
  templateUrl: 'formaspago.html',
})
export class FormaspagoPage {

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


  empresa:any;
  listaFP:any;
  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;
  registro:any = null;
  fdeposito:any;
  
  //Listados
  formaspago: Array<{ value: string, text: string }> = [];
  cuentascia: Array<{ value: string, text: string }> = [];
  indicador: Array<{ value: string, text: string }> = []; 
  bancos: Array<{ value: string, text: string }> = [];
  tarjetas: Array<{ value: string, text: string }> = [];

  //Bloques Visibles
  isVisibleFormaPago:boolean = true;
  isVisibleCtaCompania:boolean = false;
  isVisibleNoDeposito:boolean = false;
  isVisibleIndicador:boolean = false;
  isVisibleBancos:boolean = false;
  isVisibleEmisor:boolean = false;
  isVisibleCtaCheque:boolean = false;
  isVisibleNoCheque:boolean = false;
  isVisibleTarjeta:boolean = false;
  isVisibleNoTarjeta:boolean = false;
  isVisibleNoRetencion:boolean = false;
  isVisibleNoLote:boolean = false;
  isVisibleValor:boolean = true;

  
  //**** VARIABLES ********
  iddetalle = "";
  idformapago = "";
  descformapago= "";
  idbanco = "";
  descbanco = "";
  idtarjeta = "";
  desctarjeta = "";
  numero_cheque = "";
  cta_cheque = "";
  idctacia = "";
  descctacia = "";
  numerodeposito = "";
  iddocumento = "";
  //descdocumento = "";
  emisor = "";
  tipocheque = "D";
  fcobrocheque = "";
  idindicador = "N";
  descindicador= "";
  numero_lote = "";
  numero_tarjeta = "";
  numero_retencion = "";
  valor = "";

  constructor(public navParams: NavParams, 
              private view: ViewController,
              public beanSeguridad: BeanSeguridad,
              public tasksService: TasksServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    //console.log('constructor... carga'); 
    this.fdeposito= beanSeguridad.fechaActual().substring(0,10);
    this.fcobrocheque= ""; //beanSeguridad.fechaActual().substring(0,10);

    this.empresa = navParams.get('empresa');

    let loading = this.loadingCtrl.create({ content: 'Actualizando Información... <br><b>Por favor espere...</b>' });
    loading.present()
    //Cabecera Cartera
    .then(() => {
          //********** Obtencion de las Cuenta Cia *********************
          return new Promise((resolve, reject) => {
            tasksService.obtenerParametro("CUENTAS")
            .then(tasks => {
              //console.log(tasks);      
              this.registro = tasks[0];

              var cadenaJSON = ""+this.registro.VALOR;
              console.log("valor ==> "+cadenaJSON);
              //console.log("valor ==> "+cadenaJSON.replace(/\"/g,"'"));

              this.listaFP =  JSON.parse(cadenaJSON);
              for (let i = 0; i < this.listaFP.length; i++) {
                if(this.listaFP[i].empresa == this.empresa){
                  this.cuentascia.push({value: this.listaFP[i].codigo, text: this.listaFP[i].descripcion});
                }
                //Asigna la primera
                if(i == 0){ this.idctacia = this.listaFP[i].codigo;  this.descctacia = this.listaFP[i].descripcion; } 
              }

               //Retorno Respuesta
               resolve(this.listaFP);

            })
            .catch( error => {
              console.error( "ERROR ==> " + error );
              reject(error.json());
              //Mensaje Wait.......
            });
          })
          //*********************************************************
     })
    .then(() =>{
          //********** Obtencion BANCOS *********************
          return new Promise((resolve, reject) => {
              tasksService.obtenerParametro("BANCOS")
              .then(tasks => {
              //console.log(tasks);      
              this.registro = tasks[0];

              var cadenaJSON = ""+this.registro.VALOR;
              console.log("valor ==> "+cadenaJSON);
              //console.log("valor ==> "+cadenaJSON.replace(/\"/g,"'"));

              this.listaFP =  JSON.parse(cadenaJSON);
              for (let i = 0; i < this.listaFP.length; i++) {
                this.bancos.push({value: this.listaFP[i].codigo, text: this.listaFP[i].descripcion});
                
                //Asigna la primera
                if(i == 0){ this.idbanco = this.listaFP[i].codigo;  this.descbanco = this.listaFP[i].descripcion; } 
              }

              //Retorno Respuesta
              resolve(this.listaFP);

            })
            .catch( error => {
              console.error( "ERROR ==> " + error );
              reject(error.json());
              //Mensaje Wait.......
            });
          })
          //*********************************************************
    })
    .then(() => {
          //********** Obtencion TARJETAS *********************
          return new Promise((resolve, reject) => {

            tasksService.obtenerParametro("TARJETAS")
            .then(tasks => {
              //console.log(tasks);      
              this.registro = tasks[0];

              var cadenaJSON = ""+this.registro.VALOR;
              console.log("valor ==> "+cadenaJSON);
              //console.log("valor ==> "+cadenaJSON.replace(/\"/g,"'"));

              this.listaFP =  JSON.parse(cadenaJSON);
              for (let i = 0; i < this.listaFP.length; i++) {
                this.tarjetas.push({value: this.listaFP[i].codigo, text: this.listaFP[i].descripcion});
                
                //Asigna la primera
                if(i == 0){ this.idtarjeta = this.listaFP[i].codigo; this.desctarjeta =  this.listaFP[i].descripcion; } 
              }

              //Retorno Respuesta
              resolve(this.listaFP);

              })
              .catch( error => {
                console.error( "ERROR ==> " + error );
                reject(error.json());
                //Mensaje Wait.......
              });
          })
          //*********************************************************
    })
    //Detalles Cartera
    .then(() => {
          //********** Obtencion de las Formas Pago *********************
          return new Promise((resolve, reject) => {
              tasksService.obtenerParametro("FORMASPAGO")
              .then(tasks => {
                //console.log(tasks);      
                this.registro = tasks[0];

                var cadenaJSON = ""+this.registro.VALOR;
                console.log("valor ==> "+cadenaJSON);
                //console.log("valor ==> "+cadenaJSON.replace(/\"/g,"'"));

                this.listaFP =  JSON.parse(cadenaJSON);
                for (let i = 0; i < this.listaFP.length; i++) {
                  if(this.listaFP[i].codigo.indexOf(this.FP_RETENCIONFUENTE) < 0){
                    this.formaspago.push({value: this.listaFP[i].codigo, text: this.listaFP[i].descripcion }); //this.listaFP[i].descripcion.length > 13 ? this.listaFP[i].descripcion.substring(0,13).trim() : this.listaFP[i].descripcion
                  }
                }
                
                this.idformapago = this.FP_EFECTIVO;
                this.descformapago = "EFECTIVO";

                //Retorno Respuesta
                resolve(this.listaFP);

              })
              .catch( error => {
                console.error( "ERROR ==> " + error );
                reject(error.json());
                //Mensaje Wait.......
              });
          })
          //*********************************************************
    })
    //Carga Inicial
    .then(() => {
          //Cargar los parametros recibidos
          return new Promise((resolve, reject) => {

            var data = this.navParams.get('data');
            console.log("Recibido ==> "+JSON.stringify(data));

            this.iddetalle = data.iddetalle;
            this.idformapago = data.idformapago;
            this.descformapago= data.descformapago;
            
            if(parseInt(this.iddetalle) != 0){
              //Se Visualiza la Forma de Pago cargada
              this.onSelectChangeFP({value: data.idformapago, text: data.descformapago});
              
              this.idbanco = data.idbanco;
              this.descbanco = data.descbanco;
              this.idtarjeta = data.idtarjeta;
              this.desctarjeta = data.desctarjeta;
              this.numero_cheque = data.numero_cheque;
              this.cta_cheque = data.cta_cheque;
              this.idctacia = data.idctacia;
              this.descctacia = data.descctacia;
              this.numerodeposito = data.numerodeposito;
              this.iddocumento = data.iddocumento;
              //this.descdocumento = data.descdocumento;
              this.emisor = data.emisor;
              this.tipocheque = data.tipocheque;
              this.fcobrocheque = data.fcobrocheque,
              this.idindicador = data.idindicador;
              this.descindicador= data.descindicador;
              this.numero_lote = data.numero_lote;
              this.numero_tarjeta = data.numero_tarjeta;
              this.numero_retencion = data.numero_retencion;
              this.valor = data.valor;

            }

            //Retorno Respuesta            
            resolve();
        });
    })
    //Cierre Espera
    .then(() => loading.dismiss())
    
    console.log('constructor... fin');
    
  }

  //Cambio de Forma de Pago
  onSelectChangeFP(idformapago:any) {
    console.log('Text ==> '+idformapago.text+' Value ==> '+idformapago.value);
    // console.log('Cambio FP ==> '+this.idformapago);
    
    //Cambio la Descripcion de la Forma de Pago
    this.descformapago= idformapago.text;

    this.isVisibleCtaCompania = false;
    this.isVisibleNoDeposito = false;
    this.isVisibleIndicador = false;
    this.isVisibleBancos = false;
    this.isVisibleEmisor = false;
    this.isVisibleCtaCheque = false;
    this.isVisibleNoCheque = false;
    this.isVisibleTarjeta = false;
    this.isVisibleNoTarjeta = false;
    this.isVisibleNoRetencion = false;
    this.isVisibleNoLote = false;

    if(this.idformapago == this.FP_EFECTIVO){
      //Solo  Forma Pago y Valor (siempre Visibles)

    }else if(this.idformapago == this.FP_DEPOSITO){
      this.isVisibleCtaCompania = true;
      this.isVisibleNoDeposito = true;

    }else if(this.idformapago == this.FP_CHEQUE){
      this.isVisibleIndicador = true;
      this.isVisibleBancos = true;
      this.isVisibleEmisor = true;
      this.isVisibleCtaCheque = true;
      this.isVisibleNoCheque = true;

    }else if(this.idformapago == this.FP_TARJETA){
      this.isVisibleBancos = true;
      this.isVisibleTarjeta = true;
      this.isVisibleNoTarjeta = true;
      this.isVisibleNoLote = true;

    }else if(this.idformapago == this.FP_TRANSFERENCIABANCARIA){
      this.isVisibleNoDeposito = true;
      this.isVisibleCtaCompania = true;

    }else if(this.idformapago.indexOf(this.FP_RETENCIONFUENTE)> -1){
      this.isVisibleNoRetencion = true;
    }

  }

  //Evento por cambio en un Combo
  onSelectChange(idCombo:string, item:any) {
    if("CTA_CIA" == idCombo){
      this.descctacia = item.text;
    }
    if("INDICADOR" == idCombo){
      this.descindicador = item.text;
    }
    if("BANCOS" == idCombo){
      this.descbanco = item.text;
    }
    if("TARJETA" == idCombo){
      this.desctarjeta = item.text;
    }
    /*if("TIPOCH" == idCombo){
      this.tipocheque = item.text;
    }*/
  }

  ionViewWillLoad() {

    /*
    console.log('ionViewWillLoad... carga');

    //Cargar los parametros recibidos
    const data = this.navParams.get('data');
    console.log("Recibido ==> "+JSON.stringify(data));
    
    this.iddetalle = data.iddetalle;
    this.idformapago = data.idformapago;
    this.descformapago= data.descformapago;
    this.idbanco = data.idbanco;
    this.descbanco = data.descbanco;
    this.idtarjeta = data.idtarjeta;
    this.desctarjeta = data.desctarjeta;
    this.numero_cheque = data.numero_cheque;
    this.cta_cheque = data.cta_cheque;
    this.idctacia = data.idctacia;
    this.descctacia = data.descctacia;
    this.numerodeposito = data.numerodeposito;
    this.iddocumento = data.iddocumento;
    //this.descdocumento = data.descdocumento;
    this.emisor = data.emisor;
    this.idindicador = data.idindicador;
    this.descindicador= data.descindicador;
    this.numero_lote = data.numero_lote;
    this.numero_tarjeta = data.numero_tarjeta;
    this.numero_retencion = data.numero_retencion;
    this.valor = data.valor;

    console.log('ionViewWillLoad... fin'); 
    */
  }

  closeModal(tipo:string) {    
    if(tipo == 'G'){

      //Valida el Valor del Pago
      if(+this.valor <= 0){
        let alert = this.alertCtrl.create({
          title: 'Atención',
          subTitle: 'Error ==> El Valor del Pago debe ser mayor a $0.00',
          buttons: ["Aceptar"]
        });
        alert.present();  
        return false;
      }


      //Validar que toda la Informacion este correcta.
      let isError = false;
      if(this.idformapago == this.FP_EFECTIVO){
  
      }else if(this.idformapago == this.FP_DEPOSITO){
        isError = (!isError)?this.idctacia.length <=0:isError;
        isError = (!isError)?this.numerodeposito.length <=0:isError;
        isError = (!isError)?this.fdeposito.length <=0:isError;
        if(isError){
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'Error ==> Los Datos requeridos son obligatorios',
            buttons: ["Aceptar"]
          });
          alert.present();  
          return false;
        }
  
      }else if(this.idformapago == this.FP_CHEQUE){
        //exclusivo para obligar a ingresar la Fecha de cobro del CHEQUE
        isError = (!isError)?this.fcobrocheque.length <=0:isError;
        if(isError){
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'Error ==> Por favor ingrese la Fecha de Cobro del Cheque.',
            buttons: ["Aceptar"]
          });
          alert.present();  
          return false;
        }

        isError = (!isError)?this.tipocheque.length <=0:isError;
        isError = (!isError)?this.idindicador.length <=0:isError;
        isError = (!isError)?this.idbanco.length <=0:isError;
        isError = (!isError)?this.emisor.length <=0:isError;
        isError = (!isError)?this.cta_cheque.length <=0:isError;
        isError = (!isError)?this.numero_cheque.length <=0:isError;
        if(isError){
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'Error ==> Los Datos requeridos son obligatorios',
            buttons: ["Aceptar"]
          });
          alert.present();  
          return false;
        }
  
      }else if(this.idformapago == this.FP_TARJETA){
        isError = (!isError)?this.idbanco.length <=0:isError;
        isError = (!isError)?this.idtarjeta.length <=0:isError;
        isError = (!isError)?this.numero_lote.length <=0:isError;
        if(isError){
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'Error ==> Los Datos requeridos son obligatorios',
            buttons: ["Aceptar"]
          });
          alert.present();  
          return false;
        }
  
      }else if(this.idformapago == this.FP_TRANSFERENCIABANCARIA){
        //this.isVisibleNoDeposito = true;
  
      }else if(this.idformapago.indexOf(this.FP_RETENCIONFUENTE)> -1){
        //this.isVisibleNoRetencion = true;
      }


      const myModalData = { iddetalle:this.iddetalle,
                            idformapago: this.idformapago,  
                            descformapago: this.descformapago,  
                            idbanco: (this.isVisibleBancos)?this.idbanco:"",  
                            descbanco: (this.isVisibleBancos)?this.descbanco:"",  
                            idtarjeta: (this.isVisibleTarjeta)?this.idtarjeta:"",  
                            desctarjeta: (this.isVisibleTarjeta)?this.desctarjeta:"",  
                            numero_cheque: (this.isVisibleNoCheque)?this.numero_cheque:"",  
                            cta_cheque: (this.isVisibleCtaCheque)?this.cta_cheque:"",  
                            idctacia: (this.isVisibleCtaCompania)?this.idctacia:"",  
                            descctacia: (this.isVisibleCtaCompania)?this.descctacia:"",  
                            numerodeposito: (this.isVisibleNoDeposito)?this.numerodeposito:"",  
                            //iddocumento: this.iddocumento,   
                            emisor: (this.isVisibleEmisor)?this.emisor:"",  
                            tipocheque: (this.isVisibleIndicador)?this.tipocheque:"D",
                            fcobrocheque: (this.isVisibleIndicador)?this.fcobrocheque.substring(0,10):"",
                            idindicador: (this.isVisibleIndicador)?this.idindicador:"",  
                            descindicador: (this.isVisibleIndicador)?this.descindicador:"",  
                            numero_lote: (this.isVisibleNoLote)?this.numero_lote:"",  
                            numero_tarjeta: (this.isVisibleNoTarjeta)?this.numero_tarjeta:"",  
                            numero_retencion: (this.isVisibleNoRetencion)?this.numero_retencion:"",  
                            valor: this.valor };

      this.view.dismiss(myModalData);
    }
    else{
      this.view.dismiss();
    }
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FormaspagoPage');
  }

}
