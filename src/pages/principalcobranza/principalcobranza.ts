import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { NuevacobranzaPage } from '../nuevacobranza/nuevacobranza';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { CobroclientePage } from '../cobrocliente/cobrocliente';

/**
 * Generated class for the PrincipalcobranzaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principalcobranza',
  templateUrl: 'principalcobranza.html',
})
export class PrincipalcobranzaPage {

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
                cierre:boolean }>;

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
                        cierre:boolean }>;
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
    this.obtenerInformacion();    
  }
  
  onSelectChange(item:any, tipo:string) {
    if(tipo == "EMP"){
      this.empresa = item.value.trim();
      this.nombre_empresa = item.text.trim();
    }

    //Re-leer el Grid Principal
    this.obtenerInformacion();
  }

  obtenerInformacion(){

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present()
    .then(() =>{ 
        //Obtengo la Informacion Requerida
        this.items = [];
        this.tasksService.obtenerRecibosCobros(this.empresa, this.fdesde.substring(0,10), this.fhasta.substring(0,10), this.beanSeguridad.USUARIO_LOGONEADO)
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
          var lastDate = '1979-01-01';
          for (let i = 0; i < list.length; i++) {
            if(list[i].FECHA != lastDate) {
              //REGISTRO DE CIERRE
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
                               isCerrado: (list[i].CERRADO == "S"),
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
            this.items.push({id:JSON.stringify(list[i]),
                             title:list[i].CODCLIENTE + " - "+ list[i].NOMBRECLIENTE, 
                             note: "TK: "+list[i].IDRECIBO.toUpperCase() +" • $ " + this.formatNumber(list[i].VALORPAGO,2) +" • ",
                             estado: list[i].CODESTADO,
                             isEditar:isEditar,
                             isConfirmar:isConfirmar,
                             isEliminar:isEliminar,
                             isEnviar:isEnviar,
                             isReversar:isReversar,
                             isImprimir:isImprimir,
                             isCerrado:(list[i].CERRADO == "S"),
                             isVerTicket:isVerTicket,
                             cierre:false});
          }    
      
          //Respaldo para la Busqueda por Filtro
          this.itemsRespaldo = this.items;

          //Cierra Espera
          loading.dismiss();
        })
        .catch( error => { 
          console.log("ERROR ==> " + JSON.stringify(error.json())); 

          //Cierra Espera
          loading.dismiss();
        });
    });    
  
  }


  initializeItems() {
    //this.items = this.navParams.get('item');
    this.items = this.itemsRespaldo;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return ((item.title.toLowerCase()+""+item.note.toLowerCase()).indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  //Envia a Pantalla de Nueva Cobranza
  nuevaCobranza(){
    //Lista Recorridos
    let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == this.empresa){
        infoEmpresa = this.listaEmpresas[i];
      }
    }

    let parametros = {empresa:infoEmpresa.empresa, nombre_empresa: infoEmpresa.nombre};
    this.navCtrl_Pages.push(NuevacobranzaPage,parametros);
  }

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


  //Imprimir Cobro
  imprimirCobro(item:any, habilitaImprimir:string){

    console.log("imprimirCobro...."+JSON.stringify(item));
    //Obtengo la Informacion Requerida
    var entidadCobro = JSON.parse(item.id);
    //console.log("entidadCobro...."+JSON.stringify(entidadCobro));
    var detallesCobro = JSON.parse(entidadCobro.DETALLESPAGO);
    //console.log("detallesCobro...."+JSON.stringify(detallesCobro));
    var detallesDocumentos = JSON.parse(entidadCobro.DETALLESDOCU);
    //console.log("detallesDocumentos...."+JSON.stringify(detallesDocumentos));
    
    var textoImprimir = "";

    //Nombre Empresa
    //Lista Recorridos
    let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == entidadCobro.CODEMPRESA){
        infoEmpresa = this.listaEmpresas[i];
      }
    }

    let valor:any;
    //Cabecera Impresion
    textoImprimir = textoImprimir + this.pad(infoEmpresa.nombre,32,"C")+"\n";
    textoImprimir = textoImprimir + this.pad("RECIBO #"+entidadCobro.IDRECIBO,32,"C")+"\n";
    textoImprimir = textoImprimir + "Cliente: ("+entidadCobro.CODCLIENTE.trim()+") "+entidadCobro.NOMBRECLIENTE.trim()+"\n";
    textoImprimir = textoImprimir + "============ F. PAGO ===========\n";
    
    //Carga Formas de Pago
    var descformapago = "";
    var re = /BANCO/gi;
    for (let i = 0; i < detallesCobro.length; i++) {
      descformapago = detallesCobro[i].descformapago;
      /*if("CH" == detallesCobro[i].idformapago){
        descformapago = descformapago + "-" + detallesCobro[i].fcobrocheque;
      }*/

      valor = parseFloat(detallesCobro[i].valor).toFixed(2);
      textoImprimir = textoImprimir + this.pad(descformapago,15,"L")+"  "+this.pad("$ "+this.formatNumber(valor,2),15,"R")+"\n";
      if(detallesCobro[i].idformapago == this.FP_EFECTIVO){
        //Por Efectivo no se agrega mayor detalle
      }else if(detallesCobro[i].idformapago == this.FP_CHEQUE){
        textoImprimir = textoImprimir + " "+this.pad("F.Cobro: "+detallesCobro[i].fcobrocheque,28,"L")+"  "+this.pad(" ",1,"R")+"\n"; 
        textoImprimir = textoImprimir + " Bco. "+this.pad(detallesCobro[i].descbanco.toUpperCase().replace(re,"").trim(),15,"L")+" "+this.pad("Ch#"+detallesCobro[i].numero_cheque,10,"R")+"\n";
      }else if(detallesCobro[i].idformapago == this.FP_TARJETA){
        textoImprimir = textoImprimir + " Tj. " +this.pad(detallesCobro[i].desctarjeta,15,"L")+" "+this.pad("Lt#"+detallesCobro[i].numero_lote,10,"R")+"\n";
      }else if(detallesCobro[i].idformapago == this.FP_DEPOSITO){
        textoImprimir = textoImprimir + " Cta. "+this.pad(detallesCobro[i].descctacia.toUpperCase().replace(re,"").trim(),15,"L")+" "+this.pad("Dp#"+detallesCobro[i].numerodeposito,10,"R")+"\n";
      }else if(detallesCobro[i].idformapago == this.FP_TRANSFERENCIABANCARIA){
        //textoImprimir = textoImprimir + " Cta. "+this.pad(detallesCobro[i].descctacia,26,"L")+"\n";
        textoImprimir = textoImprimir + " Cta. "+this.pad(detallesCobro[i].descctacia.toUpperCase().replace(re,"").trim(),15,"L")+" "+this.pad("Dp#"+detallesCobro[i].numerodeposito,10,"R")+"\n";
      }else if(detallesCobro[i].idformapago.indexOf(this.FP_RETENCIONFUENTE)> -1){
        //textoImprimir = textoImprimir + this.pad("Bco. "+detallesCobro[i].descbanco,15,"L")+"  "+this.pad("Dp# "+detallesCobro[i].numerodeposito,15,"R")+"\n";
      }
    }
    
    //Total Formas de Pago
    valor = parseFloat(entidadCobro.VALORPAGO).toFixed(2);
    textoImprimir = textoImprimir + this.pad("________________________________",16,"L")+"\n";    
    textoImprimir = textoImprimir + "TOTAL F/P: $"+ this.pad(this.formatNumber(valor,2),32,"L")+"\n";
    
    //Documentos Aplicados
    textoImprimir = textoImprimir + "=========== DOCUMENTOS =========\n";
    var totalAplicado= 0;
    var saldoDocumento:any;
     for (let i = 0; i < detallesDocumentos.length; i++) {
      textoImprimir = textoImprimir + this.pad(detallesDocumentos[i].NUMDOCUMENTO,32,"L")+"\n";
      valor = +parseFloat(detallesDocumentos[i].VALORXAPLICAR.replace(",","")).toFixed(2) * 1;
      saldoDocumento = +parseFloat(detallesDocumentos[i].VALORSALDO.replace(",","")).toFixed(2) * 1;   
      //Obtengo saldo Real del Documento (Con la Aplicación)   
      saldoDocumento = saldoDocumento - valor;
      saldoDocumento = parseFloat(saldoDocumento).toFixed(2);
      textoImprimir = textoImprimir + " "+this.pad((saldoDocumento <= parseFloat("0").toFixed(2)?"Canc.: $":"Abono: $")+this.formatNumber(valor,2),31,"L")+"\n";
      textoImprimir = textoImprimir + " "+this.pad("Saldo: $"+this.formatNumber(saldoDocumento,2),31,"L")+"\n";
      totalAplicado = totalAplicado + (+detallesDocumentos[i].VALORXAPLICAR);
    }
    //Total Documento
    valor = parseFloat(""+totalAplicado).toFixed(2);
    textoImprimir = textoImprimir + this.pad("________________________________",16,"L")+"\n";
    textoImprimir = textoImprimir + "TOTAL CANC.: $"+ this.pad(this.formatNumber(valor,2),32,"L")+"\n";
    
    //Pie Impresión
    textoImprimir = textoImprimir + "================================\n";
    textoImprimir = textoImprimir + "E-mail: "+entidadCobro.EMAILCLIENTE+"\n";
    textoImprimir = textoImprimir + "Vnd: "+entidadCobro.NOMBREUSUARIO+"\n";
    textoImprimir = textoImprimir + "Fecha: "+entidadCobro.FECHA+"\n";    
    textoImprimir = textoImprimir + "\n\n________________________________\n";
    textoImprimir = textoImprimir + this.pad("-Firma Cliente-",32,"C")+"\n\n\n\n";
    console.log("textoImprimir ==> \n"+textoImprimir);

    //Envio a Pantalla Externa
    //let habilitaImprimir:string = (entidadCobro.CODESTADO != "1" && entidadCobro.CODESTADO != "3" ? "S" : "N");
    const myModalOptions: ModalOptions = { enableBackdropDismiss: false };
    const myModal: Modal = this.modal.create('ImprimirPage', {data:[], texto:textoImprimir, imprimir:habilitaImprimir}, myModalOptions);
    myModal.present();

    /*
    //Ingreso/Actualizacion de las FPago
    myModal.onDidDismiss((data) => {
      console.log("onDidDismiss ==> "+ JSON.stringify(data));
    });

    myModal.onWillDismiss((data) => {
      console.log("onWillDismiss ==> "+ JSON.stringify(data));
    });*/

  }

  //Imprime el Cierre por Dia
  imprimirCierre(idCierre, objCierre:any, habilitaImprimir:string){

    let item:any = JSON.parse(objCierre.DETALLECIERRE)
    console.log("imprimirCierre.."+JSON.stringify(item));
    let textoImprimir = "";
    let objetoFP:any;
    let valor:any;

    //Cabecera Impresion
    textoImprimir = textoImprimir + this.pad(this.nombre_empresa,32,"C")+"\n";
    textoImprimir = textoImprimir + this.pad("Resumen Cobranzas",32,"C")+"\n";
    textoImprimir = textoImprimir + this.pad("Dia:("+idCierre+")",32,"C")+"\n";
    textoImprimir = textoImprimir + "================================\n";
    textoImprimir = textoImprimir + this.pad("Refer. Cierre:"+objCierre.NUMDEPOSITO,32,"L")+"\n";
    textoImprimir = textoImprimir + this.pad("Cant. Recibos: "+(objCierre.VALOR!=null &&  ""!= objCierre.VALOR?objCierre.VALOR:"-"),32,"L")+"\n";
    textoImprimir = textoImprimir + this.pad("Cobrador: "+(this.beanSeguridad.NOMBRE_USUARIO),32,"L")+"\n";
    textoImprimir = textoImprimir + "================================\n";

    //Imprime Efectivo
    objetoFP = item.EF[0];
    console.log("EF => "+ JSON.stringify(objetoFP));
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== EFECTIVO ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL EFECTIVO:",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.total,2),15,"R")+"\n";
    }

    //Imprime Cheque
    objetoFP = item.CH[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== CH. DIA ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + " "+this.pad("F.Cobro: "+objetoFP.data[i].ref3,28,"L")+"  "+this.pad(" ",1,"R")+"\n"; 
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      } 
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL CH. DIA:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";        
    }
    
    //Imprime Cheque Post
    objetoFP = item.CHP[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== CH. POSF. ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + " "+this.pad("F.Cobro: "+objetoFP.data[i].ref3,28,"L")+"  "+this.pad(" ",1,"R")+"\n"; 
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      }  
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL CH. POSF:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";         
    }

    //Imprime Deposito
    objetoFP = item.DP[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== DEPOSITO ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      }    
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL DEPOSITO:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";  
    }
    
    //Imprime Tarjeta
    objetoFP = item.TJ[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== TARJETA ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      }
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL TARJETA:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";     
    }
    
    //Imprime Transferencia
    objetoFP = item.TR[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== TRANSFERENCIA ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      }      
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL TRANSF.:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";
    }

    //Imprime Retencion
    objetoFP = item.RF[0];
    if(objetoFP.data.length > 0){
      textoImprimir = textoImprimir + this.pad("==== RETENCION ("+objetoFP.cantidad+") ====",32,"C")+"\n";
      for (let i = 0; i < objetoFP.data.length; i++) {
        textoImprimir = textoImprimir + this.pad(objetoFP.data[i].ref1,15,"L")+"  "+this.pad(objetoFP.data[i].ref2,15,"R")+"\n";
        textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("$"+this.formatNumber(objetoFP.data[i].valor,2),15,"R")+"\n";
      }      
      //Total Formas de Pago
      valor = parseFloat(objetoFP.total).toFixed(2);
      textoImprimir = textoImprimir + this.pad("",15,"L")+"  "+this.pad("_______________",15,"R")+"\n";
      textoImprimir = textoImprimir + this.pad("TOTAL RETENCION:",15,"L")+"  "+this.pad("$"+this.formatNumber(valor,2),15,"R")+"\n";
    }

    textoImprimir = textoImprimir + "\n\n________________________________\n";
    textoImprimir = textoImprimir + this.pad("-Firma Vendedor-",32,"C")+"\n\n\n\n";
    console.log("textoImprimir ==> \n"+textoImprimir);

    //Envio a Pantalla Externa
    const myModalOptions: ModalOptions = { enableBackdropDismiss: false };
    const myModal: Modal = this.modal.create('ImprimirPage', {data:[], texto:textoImprimir, imprimir:habilitaImprimir}, myModalOptions);
    myModal.present();

  }

  /*** VISUALIZA EL REPORTE DEL CIERRE DEL DIA DE COBRANZAS */
  verReporteCierre(item:any){
    let loading = this.loadingCtrl.create({ content: 'Validando Cierre... <br><b>Por favor espere...</b>' });
    loading.present();

    //Verifica - Si fue cerrado envio a la impresion de cierre  
    var idCierre = item.id; //Fecha  
    this.tasksService.obtenerCierreCobranzas(this.empresa,  idCierre)
    .then(data => { 
      if(data.length <= 0){
        //Cierra Espera
        loading.dismiss(); 
        
        //Realiza el cierre de la cobranza
        this.procesarCierre(idCierre, "0")
        .then(data1 => { 
          this.imprimirCierre(idCierre, data1[0],"N");   //JSON.parse(data1[0].DETALLECIERRE)
        });  
      }else{
        //Cierra Espera
        loading.dismiss();  

        //Envia a Imprimir
        let habilitaImprimir:string = (data[0].BANCO == "S"?"S":"N");
        if(habilitaImprimir == "N"){
          //Realiza el cierre de la cobranza
          this.procesarCierre(idCierre, "0")
          .then(data1 => {  
            console.log("error data1 ==> "+data1);
            this.imprimirCierre(idCierre, data1[0], habilitaImprimir);  //JSON.parse(data1[0].DETALLECIERRE)
          }); 
        }else{
          //Envia a Imprimir de Manera directa - Porque se cerro por completo el dia
          this.imprimirCierre(idCierre, data[0], habilitaImprimir); //JSON.parse(data[0].DETALLECIERRE)
        }
      }
    });  
  }

  /** Genera el Cierre del Dia de Cobranzas ***/
  cierreDiaCobranza(item:any){

    //console.log("cierreDiaCobranza...."+JSON.stringify(item));
    var idCierre = item.id; //Fecha
    let alert = this.alertCtrl.create({
      title: ''+idCierre,
      inputs: [ { name: 'numdeposito', placeholder:'# Deposito' , type: 'number' } ],
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            console.log('Aplicar clicked');  
            if(data.numdeposito.length <= 0 || (+data.numdeposito) <= 0){
              let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: 'Error ==> Por favor digite el No. Deposito correcto.',
                buttons: ["Aceptar"]
              });
              alert.present();  
              return false;
            }
            
            //Envia a Procesar el Cierre
            this.procesarCierre(idCierre, data.numdeposito)
            .then(data => { 
              let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: 'Cierre del Dia:'+idCierre+' ejecutado Correctamente.',
                buttons: ["Aceptar"]
              });
              alert.present();
              //Re-leer el Grid Principal
              this.obtenerInformacion();
            }); 
          }
        },
        {
          text: 'Cerrar',
          //role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }        
      ]
    });
    alert.present();      
  }

  //Procesa el Cierre
  procesarCierre(idCierre:string, numdeposito:string){
    
    let loading = this.loadingCtrl.create({ content: 'Procesando Cierre <b>'+idCierre+'... <br>Por favor espere...</b>' });
    loading.present();

    //Variables de Acumulacion de las formas de Pago
    let listaEF = {cantidad:'0', total: '0', data:[]}; //Efectivo
    let listaDP = {cantidad:'0', total: '0', data:[]}; //Deposito
    let listaCH = {cantidad:'0', total: '0', data:[]}; //Cheque
    let listaCHP = {cantidad:'0', total: '0', data:[]}; //Cheque Postf.
    let listaTJ = {cantidad:'0', total: '0', data:[]}; //Tarjeta
    let listaTR = {cantidad:'0', total: '0', data:[]}; //Transferencia
    let listaRF = {cantidad:'0', total: '0', data:[]}; //Retencion
    let valor:any;
    
    //Verifica si en el Dia existen cobros sin enviar
    return this.tasksService.obtenerCobrosCierre(this.empresa,  idCierre) //Todos
    .then(data => { 
      //Recorre los cobros
      var detallesCobro:any;
      for (let i = 0; i < data.length; i++) {

        //Validacion Estado del cobro
        if(data[i].CODESTADO == 'ACTIVO' || data[i].CODESTADO == 'CONFIRMADO'){
          //Cierra Espera
          loading.dismiss();

          let mensajeError = 'Error ==> No se puede procesar el Dia: <b>'+idCierre+'</b>, existen Recibos no <b>ENVIADOS</b>.';
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: mensajeError,
            buttons: ["Aceptar"]
          });
          alert.present(); 
          throw {error:mensajeError}; //Manejo de Error evita continuar
        }

        detallesCobro = JSON.parse(data[i].DETALLESPAGO);
        //Recorro las Formas de Pago para el cobro
        for (let x = 0; x < detallesCobro.length; x++) {
          //Valor del Pago
          valor = (+parseFloat(detallesCobro[x].valor).toFixed(2) * 1);

          if(detallesCobro[x].idformapago == this.FP_EFECTIVO){
            listaEF.cantidad = ""+(+listaEF.cantidad + 1);
            listaEF.total = ""+(+parseFloat(listaEF.total).toFixed(2) + valor);
            listaEF.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'',  ref2:'' });
          
          }else if(detallesCobro[x].idformapago == this.FP_DEPOSITO){
            listaDP.cantidad = ""+(+listaDP.cantidad + 1);
            listaDP.total = ""+(+parseFloat(listaDP.total).toFixed(2) + valor);
            listaDP.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'Bco. '+detallesCobro[x].descbanco,  ref2:'Dp#'+detallesCobro[x].numerodeposito });
          
          }else if(detallesCobro[x].idformapago == this.FP_CHEQUE){
            if(detallesCobro[x].tipocheque == 'D'){ //CH al Dia
              listaCH.cantidad = ""+(+listaCH.cantidad + 1);
              listaCH.total = ""+(+parseFloat(listaCH.total).toFixed(2) + valor);
              listaCH.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'Bco. '+detallesCobro[x].descbanco,  ref2:'Ch#'+detallesCobro[x].numero_cheque, ref3:detallesCobro[x].fcobrocheque });
            }else{ //CH Postfechado
              listaCHP.cantidad = ""+(+listaCHP.cantidad + 1);
              listaCHP.total = ""+(+parseFloat(listaCHP.total).toFixed(2) + valor);
              listaCHP.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'Bco. '+detallesCobro[x].descbanco,  ref2:'Ch#'+detallesCobro[x].numero_cheque, ref3:detallesCobro[x].fcobrocheque });
            }
          
          }else if(detallesCobro[x].idformapago == this.FP_TARJETA){
            listaTJ.cantidad = ""+(+listaTJ.cantidad + 1);
            listaTJ.total = ""+(+parseFloat(listaTJ.total).toFixed(2) + valor);
            listaTJ.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'Bco. '+detallesCobro[x].descbanco,  ref2:'Lt#'+detallesCobro[x].numero_lote });
          
          }else if(detallesCobro[x].idformapago == this.FP_TRANSFERENCIABANCARIA){
            listaTR.cantidad = ""+(+listaTR.cantidad + 1);
            listaTR.total = ""+(+parseFloat(listaTR.total).toFixed(2) + valor);
            listaTR.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'Bco. '+detallesCobro[x].descbanco,  ref2:'Tr#'+detallesCobro[x].iddocumento });
          
          }else if(detallesCobro[x].idformapago.indexOf(this.FP_RETENCIONFUENTE)> -1){
            listaRF.cantidad = ""+(+listaRF.cantidad + 1);
            listaRF.total = ""+(+parseFloat(listaRF.total).toFixed(2) + valor);
            listaRF.data.push({idformapago:detallesCobro[x].idformapago, valor: detallesCobro[x].valor, ref1:'RF# '+detallesCobro[x].numero_retencion,  ref2:'' });
          }
        }
      }

      //Genero Cadena de Guardado del Cierre
      var cadenaFinal = {EF:[listaEF], DP:[listaDP], CH:[listaCH], CHP:[listaCHP], TJ:[listaTJ], TR:[listaTR], RF:[listaRF]}
      var registroCierre = {
            CODEMPRESA: this.empresa, 
            IDCIERRE: idCierre, 
            BANCO:(+numdeposito > 0 ? "S" : "N"), 
            NUMDEPOSITO: numdeposito, 
            VALOR:''+data.length, 
            DETALLECIERRE:JSON.stringify(cadenaFinal) 
      };

      // *** Insertar Registro ************
      this.tasksService.obtenerCierreCobranzas(this.empresa,  idCierre)
      .then(data => { 
        if(data.length <= 0){
          this.tasksService.insertarRegistros(this.tasksService.TABLA_COBCIERRE, registroCierre)
          .then(response => {})
          .catch( error => { 
            //console.log("error registroCierre ==> "+JSON.parse(error));
            Promise.reject( error);
          });
        }else{
          this.tasksService.actualizarCierreCobranzas(registroCierre)
          .then(response => {})
          .catch( error => { 
            //console.log("error registroCierre ==> "+JSON.parse(error));
            Promise.reject( error);
          });
        }
      })
      .catch( error => { 
          console.log("error registroCierre ==> "+JSON.parse(error));
          Promise.reject( error);
      });

      //Cierra Espera
      loading.dismiss();

      //Retorno del Registro
      let registros = [];
      registros.push( registroCierre );
      return Promise.resolve( registros );
     
    });
  }



  //Editar Cobro
  editarCobro(item:any){
    console.log("editarCobro...."+JSON.stringify(item));    
    //Obtengo la Informacion Requerida
    let entidadCobro = JSON.parse(item.id);
    let infoEmpresa:any;
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      if(this.listaEmpresas[i].empresa == entidadCobro.CODEMPRESA){
        infoEmpresa = this.listaEmpresas[i];
      }
    }

    //Abre la Pantalla de Edicion
    entidadCobro.empresa = infoEmpresa.empresa;
    entidadCobro.nombre_empresa = infoEmpresa.nombre;
    entidadCobro.nuevo = 'N';

    console.log("entidadCobro...."+JSON.stringify(entidadCobro)); 
    let parametros = entidadCobro;
    this.navCtrl_Pages.push(CobroclientePage,parametros);
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

  //Enviar Cobro
  enviarCobro(item:any, SECUENCIARECIBO:string){
    console.log("enviarCobro....");
    //Obtengo la Informacion Requerida
    var re = /#/gi;
    var entidadCobro = JSON.parse(item.id.replace(re,''));
    var detallesCobro = JSON.parse(entidadCobro.DETALLESPAGO);
    var detallesDocumentos = JSON.parse(entidadCobro.DETALLESDOCU);

    let parametroWS:any;
    let respuestaWS:any;

    let loading = this.loadingCtrl.create({ content: 'Enviando Información... <br><b>Por favor espere...</b>' });
    loading.present();

    //Formateo el envio de documentos para que la cadena no sea tan larga
    let formasPagoEnvio: any = [];
    for (let index = 0; index < detallesCobro.length; index++) {
      formasPagoEnvio.push({"iddetalle":detallesCobro[index].iddetalle,
                          "idformapago":detallesCobro[index].idformapago,
                          "idbanco":detallesCobro[index].idbanco,
                          "idtarjeta":detallesCobro[index].idtarjeta,
                          "numero_cheque":detallesCobro[index].numero_cheque,
                          "cta_cheque":detallesCobro[index].cta_cheque,
                          "idctacia":detallesCobro[index].idctacia,
                          "numerodeposito":detallesCobro[index].numerodeposito,
                          "emisor":detallesCobro[index].emisor,
                          "tipocheque":detallesCobro[index].tipocheque,
                          "fcobrocheque":detallesCobro[index].fcobrocheque,
                          "idindicador":detallesCobro[index].idindicador,
                          "numero_lote":detallesCobro[index].numero_lote,
                          "numero_tarjeta":detallesCobro[index].numero_tarjeta,
                          "numero_retencion":detallesCobro[index].numero_retencion,
                          "valor":detallesCobro[index].valor});
    }

    let documentosEnvio: any = [];
    for (let index = 0; index < detallesDocumentos.length; index++) {
      documentosEnvio.push({"REFERENCIA":detallesDocumentos[index].REFERENCIA,
                          "NUMCUOTA":detallesDocumentos[index].NUMCUOTA,
                          "VALORCUOTA":detallesDocumentos[index].VALORCUOTA,
                          "VALORSALDO":detallesDocumentos[index].VALORSALDO,
                          "VALORXAPLICAR":detallesDocumentos[index].VALORXAPLICAR});
    }
    //*********************************************************************

    return new Promise((resolve, reject) => {
      let registroCabecera = {CODEMPRESA:entidadCobro.CODEMPRESA,
                              IDRECIBO:(SECUENCIARECIBO != null ? SECUENCIARECIBO : entidadCobro.IDRECIBO),
                              FECHA:entidadCobro.FECHA,
                              CODUSUARIO:entidadCobro.CODUSUARIO,
                              CODCLIENTE:entidadCobro.CODCLIENTE,
                              VALORPAGO:entidadCobro.VALORPAGO};

      parametroWS = {codusuario:this.beanSeguridad.USUARIO_LOGONEADO, 
                     cabeceraCobro:JSON.stringify(registroCabecera), 
                     detallesCobro:JSON.stringify(formasPagoEnvio), 
                     detallesDocumentos:JSON.stringify(documentosEnvio)};
                     
      this.beanSeguridad.obtenerInformacionWS("GUARDAR_COBRO_CXC", parametroWS)
      .then(data => {
        respuestaWS = data;

        if(respuestaWS.exito == "true"){
          //Cambia el estado del Cobro
          this.tasksService.cambiarEstadoCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID, 'ENVIADO', null)
          .then(data => { 
            //Cierra Espera
            loading.dismiss();

            //Mensaje Eliminado
            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: 'El Recibo '+registroCabecera.IDRECIBO.toUpperCase()+ " fue enviado con exito.",
              buttons: ["Aceptar"]
            });
            alert.present(); 

            //Re-leer el Grid Principal
            this.obtenerInformacion();
            
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

  
  //Confirmar Cobro
  actualizarCobro(item:any, tipo:string){
    console.log("confirmarCobro....");
    //Actualiza Estado del Cobro
    //Obtengo la Informacion Requerida
    var entidadCobro = JSON.parse(item.id);

     //Mensaje de Confirmacion del Pago
     let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: "¿Está Seguro que desea "+(("REV" == tipo)?'Reversar':'Confirmar')+" el Cobro?", //entidadCobro.IDRECIBO.toUpperCase()
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
                          this.enviarCobro(item, SECUENCIARECIBO);
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
                      this.obtenerInformacion();
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
                    this.obtenerInformacion();
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

  //Eliminar Cobro
  eliminarCobro(item:any){

    console.log("eliminarCobro...."+JSON.stringify(item));
    //Obtengo la Informacion Requerida
    var entidadCobro = JSON.parse(item.id);

     //Mensaje de Confirmacion del Pago
     let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: "¿Está Seguro que desea Eliminar el Cobro?", //"+entidadCobro.IDRECIBO+"
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
                this.tasksService.eliminarCobros(entidadCobro.CODEMPRESA,  entidadCobro.ID)
                .then(data => { 
                  //Cierra Espera
                  loading.dismiss();

                  //Mensaje Eliminado
                  let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: 'El Recibo fue eliminado con exito.', //'+entidadCobro.IDRECIBO+ "
                    buttons: ["Aceptar"]
                  });
                  alert.present(); 

                  //Re-leer el Grid Principal
                  this.obtenerInformacion();
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
    console.log('ionViewDidLoad PrincipalcobranzaPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter PrincipalcobranzaPage');
    //Cargar Informacion Inicial
    this.obtenerInformacion();  
  }

  

}
