import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';

/**
 * Generated class for the SaldonotascreditoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saldonotascredito',
  templateUrl: 'saldonotascredito.html',
})
export class SaldonotascreditoPage {

  //Variables ManejanTodo el Formulario
  isFormasPago:boolean = true;
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
  listaDocumentosAcum:any = {data:[]};
  TOTAL_FPAGOS:string = "0.00";
  TOTAL_APLICAR:string = "0.00";
  //************************************

  idRecibo = null;
  filtro_empresa = null;
  filtro_item = null;
  nombre_empresa = null;
  filtro_cliente = null;
  codigo_cliente = null;
  nombre_cliente = null;
  //SECUENCIARECIBO:string  = "0";
  titulo_opcion = null;
  isNuevo:boolean  = false;
  filtro_articulo = null;
  idmoduloSel = null;
  idtiponcSel = null;

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

  marcartodos : boolean;
  obsVendedor: String ="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public tasksService: TasksServiceProvider,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController,
              private modal: ModalController) {

    console.log("SaldoNotaCredito....");
    console.log("SaldoNotaCreditoPage ID...."+navParams.get('ID'));

    if (navParams.get('nuevo') == 'S'){
      this.filtro_empresa = navParams.get('empresa');
      this.nombre_empresa = navParams.get('nombre_empresa');
      this.isNuevo = navParams.get('nuevo') == 'S';
      this.idmoduloSel = navParams.get('modulo');
      this.idtiponcSel = navParams.get('tiponc');
      this.listaDocumentosAcum.data = []
    }else{

      this.filtro_empresa = navParams.get('empresa');
      this.nombre_empresa = navParams.get('nombre_empresa');
      this.isNuevo = false;//navParams.get('nuevo') == 'N';
      this.idmoduloSel = navParams.get('TIPONOTACREDITO').split("-")[1];
      this.idtiponcSel = navParams.get('TIPONOTACREDITO').split("-")[0];
      console.log("FILTROS-->"+this.filtro_empresa+"-"+this.nombre_empresa +"-"+this.idmoduloSel +"-"+this.idtiponcSel);
    }

    if(this.isNuevo){
      this.filtro_cliente = navParams.get('cliente');
      this.codigo_cliente = this.filtro_cliente.split('-')[0].trim();
      this.nombre_cliente = this.filtro_cliente.split('-')[1].trim();
      this.titulo_opcion = "Nota de Crédito / "+this.nombre_empresa;
      this.idRecibo = "0"; //No tiene ID asignado
    }else{
      console.log("NO ES NUEVO");
      this.filtro_cliente = navParams.get('CLIENTE');
      this.codigo_cliente = navParams.get('CLIENTE').split('-')[0].trim();
      this.nombre_cliente = navParams.get('CLIENTE').split('-')[1].trim();
      this.titulo_opcion = "Nota de Credito / "+this.nombre_empresa;//navParams.get('IDNOTACREDITO').trim()+ " / "+this.nombre_empresa;
      this.idRecibo = navParams.get('ID').trim(); //Tiene ID asignado (ROWID)*/
      this.obsVendedor =navParams.get('OBSERVACIONES').trim();

      this.items = [];

      var detallesnotacre =navParams.get('DETALLESNC');
      this.listaDocumentos.data  = JSON.parse(detallesnotacre);
      this.listaDocumentosAcum.data = JSON.parse(detallesnotacre);
      let datax = this.listaDocumentos.data;

      for (let i = 0; i < datax.length; i++) {

        //Inserta el Registro a Pantalla
        this.items.push({id: JSON.stringify(datax[i]),
          titulo:'ARTICULO: '+ datax[i].ARTICULO,
          titulo1:' PRECIO FACTURADO $ '+ datax[i].PRECIO,
          b1: 'FECHA:',
          b2: '',
          b3: '',
          b4: '% DESCUENTO: ',
          b5: 'CANTIDAD DEVUELTA: ',
          b6: 'DEVOLVER',
          b7: 'FACTURA # ',
          v1: datax[i].FECHAREGISTRO,
          v2: '(CANTIDAD FACTURADA: '+datax[i].CANTIDAD+')',
          v3: datax[i].NUMCMPRVENTA,
          v4: datax[i].PORCDESCUENTO,
          v5: "" ,
          v6: datax[i].CANTIDADDEVUELTA,
          v7: datax[i].NUMDOCUMENTO,
          isBloqueado: datax[i].BLOQUEADO
        });

        //console.log("DOCUMENTO APLICADO: "+JSON.stringify(data[i]));
        //Ingreso a la lista los registros modificados
        //this.listaDocumentos.data.push(datax[i]);

      }



      //--
    }

    //Inicializa la Informacion
    //this.inicializarComponentes();

  }
  inicializarComponentes() {

    this.marcartodos = false;
    this.listaDocumentos.data = [];
    console.log("PARAMETRO EMPRESA: "+this.filtro_empresa+", cliente:"+this.codigo_cliente);
    //Iniciar con Formas de Pago Cargados
    /*this.listaDocumentos.data = [];
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
      })
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
      })*/
  }

  //************* CAMBIO DE TAB *****************
  cambioTab(){
    //Filtro articulo - Obligatorio
    this.isDocumentos = true;
    if(this.filtro_articulo == null || "" == this.filtro_articulo){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El Filtro de articulo es necesario, por favor ingrese un valor válido.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }
    //this.inicializarComponentes();09032021
    this.listaDocumentos.data = [];
    this.marcartodos = false;
    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información Items... <br><b>Por favor espere...</b>' });
    loading.present()
      .then(() =>{
        //Obteniendo Informacion
        this.tasksService.obtenerItemDevolucion({empresa:this.filtro_empresa, cliente:this.codigo_cliente, articulo:this.filtro_articulo})
          .then(data => {
            console.log("CantidadEncontrados"+data.length);
            if(data.length > 0){
              this.listaDocumentos.data = data;
              this.cargarListaDocumentos();
            }else {
              this.tasksService.obtenerFacturaDevolucion({empresa:this.filtro_empresa, cliente:this.codigo_cliente, articulo:this.filtro_articulo})
              .then(data =>{
                if (data.length > 0){
                  console.log("CantidadEncontrados"+data.length);
                  this.listaDocumentos.data = data;
                  this.cargarListaDocumentos();
                }else{
                  let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: 'No existen resultados para la busqueda realizada.',
                    buttons: ["Aceptar"]
                  });
                  alert.present();
                  return;
                }
              });
            }
          });
      });

    //this.inicializarComponentes();09032021
    loading.dismiss();
    /*.then(() =>{
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
      //this.cambioTab();

      //Cierra Espera
      loading.dismiss();
    })*/
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
            isBloqueado: 'S'});

          //TotalFP = TotalFP + (+data[i].valor);
        }
        //Respaldo para la Busqueda por Filtro
        //this.TOTAL_FPAGOS = ""+TotalFP;

        //Cierra Espera
        loading.dismiss();
      });
  }

//Realiza la Busqueda de Clientes
  cargarListaDocumentos() {
    //console.log("Datos de articulos..."+JSON.stringify(this.listaDocumentos.data));
    this.isDocumentos = true;
    if(!this.isDocumentos){
      return;
    }

    //Si existen valores por Aplicar
    let aplicar = (+this.TOTAL_APLICAR) * 1 > 0;

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información Articulos... <br><b>Por favor espere...</b>' });
    loading.present()
      .then(() =>{
        //Obtengo la Informacion Requerida
        this.items = [];
        let data = this.listaDocumentos.data;

        //Carga de los registros
        var valorTotalFormasPago = (+this.TOTAL_FPAGOS) * 1;
        var valorTotalAplicado = 0;
        //var valorFaltaAplicar = 0;
        //var valorSaldoDocumento = 0;
        var valorAplicaDocumento = 0;

        this.listaDocumentos.data = [];
        console.log("MUESTRA-->"+data);
        for (let i = 0; i < data.length; i++) {

          //Aplicacion de las Fomas de Pago
          if(aplicar){
            //si el registro esta bloqueado por edicion
            if(data[i].BLOQUEADO.trim() == "S"){
              //valorAplicaDocumento = +parseFloat(""+data[i].VALORXAPLICAR.replace(",","")).toFixed(2) * 1;
              valorAplicaDocumento = +parseInt(data[i].CANTIDADDEVUELTA);
              valorTotalAplicado = valorTotalAplicado + valorAplicaDocumento;
            }else{
              data[i].VALORXAPLICAR = "0";
              data[i].BLOQUEADO = "N";
            }
          }
          //}

          //Inserta el Registroa a Pantalla
          this.items.push({id: JSON.stringify(data[i]),
            titulo:'ARTICULO: '+ data[i].ARTICULO,
            titulo1:' PRECIO FACTURADO $ '+ data[i].PRECIO,
            b1: 'FECHA:',
            b2: '',
            b3: '',
            b4: '% DESCUENTO: ',
            b5: 'CANTIDAD DEVUELTA: ',
            b6: 'DEVOLVER',
            b7: 'FACTURA # ',
            v1: data[i].FECHAREGISTRO,
            v2: '(CANTIDAD FACTURADA: '+data[i].CANTIDAD+')',
            v3: data[i].NUMCMPRVENTA,
            v4: data[i].PORCDESCUENTO,
            v5: "" ,
            v6: data[i].CANTIDADDEVUELTA ,
            v7: data[i].NUMDOCUMENTO,
            isBloqueado: data[i].BLOQUEADO
          });

          //console.log("DOCUMENTO APLICADO: "+JSON.stringify(data[i]));
          //Ingreso a la lista los registros modificados
          this.listaDocumentos.data.push(data[i]);

        }

        //Respaldo para la Busqueda por Filtro
        this.TOTAL_APLICAR = ""+valorTotalAplicado;
        console.log("ValorAplicado->"+ this.TOTAL_APLICAR );
        //Cierra Espera
        loading.dismiss();
      });
  }

  aplicarPagoDocumentos(){
    this.cargarListaDocumentos();
  }



  /**** PROCESO ELIMINA FPAGO PANTALLA */
  eliminarFormaPago(cadenaFP:any) {
    //console.log("eliminarFormaPago..."+JSON.stringify(cadenaFP));
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
      message: '¿Está Seguro que desea Eliminar el registro?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            //console.log('Yes selected');
            this.eliminarFormaPago(JSON.parse(item.id));
          }
        },
        {
          text: 'No',
          handler: () => {
            //console.log('No selected!');
          }
        }
      ]
    });
    confirm.present();
  }

//Enlaza a la pantalla de Pagos Nuevos
  /*modificarPago(item){
    //Cargar Forma de Pago
    this.abrirNuevaFormaPago(JSON.parse(item.id));
  }*/

//Guardar el Cobro
  guardarnc(){
    console.log("ingreso a GUARDAR");
    console.log("listaAcumuladaINICIAL==>"+JSON.stringify(this.listaDocumentosAcum.data));
    var obstamanio = this.obsVendedor.length;
    if(  obstamanio <= 0 ) {
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'Error ==> Es obligatorio el registro del campo Observaciones.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }
    //Validaciones
    //let totalFormasPago  = //+parseFloat(this.TOTAL_FPAGOS.replace(",","")).toFixed(2) * 1;
    /*let totalDocumentos  = +parseFloat(this.TOTAL_APLICAR.replace(",","")).toFixed(2) * 1;
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
    }*/

    let loading = this.loadingCtrl.create({ content: 'Validando Información... <br><b>Por favor espere...</b>' });
    loading.present();


    var valorTotalAplicado = 0;
    var listaAplicados = [];
    let detallesDocumentos = this.listaDocumentosAcum.data;
    console.log("listaDocumentos"+JSON.stringify(detallesDocumentos));
    for (let i = 0; i < detallesDocumentos.length; i++) {
      //Si tiene un valor aplicado se considera
      if((+detallesDocumentos[i].CANTIDADDEVUELTA) > 0){
        //valorTotalAplicado = valorTotalAplicado + (+detallesDocumentos[i].VALORXAPLICAR);
        listaAplicados.push(detallesDocumentos[i]);
      }
    }

    //Cierra Espera
    loading.dismiss();

    //console.log("GUARDAR NOTA DE CREDITO==> ");
    //Mensaje de Confirmacion del Pago
    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: (listaAplicados.length <= 0?" <b> NO SE HAN REGISTRADO ITEMS A DEVOLVER A NINGUNA FACTURA  </b><br>":"")+'¿Está Seguro que desea Guardar los Cambios?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            /************ GUARDADO  **************/
              //console.log('Yes selected');


            var registroNotaCredito = {
                ID: (this.isNuevo?"-":this.idRecibo),
                CODEMPRESA: this.filtro_empresa,
                TIPONOTACREDITO:this.idtiponcSel+"-"+this.idmoduloSel,
                IDNOTACREDITO: null,
                FECHA: this.beanSeguridad.fechaActual().substring(0, 10),
                CODUSUARIO: this.beanSeguridad.USUARIO_LOGONEADO,
                CLIENTE: this.codigo_cliente+"-"+this.nombre_cliente,
                DETALLESNC: JSON.stringify(listaAplicados),
                CODESTADO: 'ACTIVO',
                OBSERVACIONES: this.obsVendedor,
                FECRESP_MWB: null
              };

            //Ejecuto Guardado de los cambios
            //console.log("NUEVO-->"+this.isNuevo);
            if(!this.isNuevo){
              // *** Actualizar Registro ************
              this.tasksService.actualizarNotaCredito(registroNotaCredito)
                .then(response => {
                  console.log("guardado ACTUALIZAR Exitoso");
                  let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: 'Solicitud de Nota de Credito Modificado Exitosamente.',
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
              console.log("InsertaELSE-->"+JSON.stringify(registroNotaCredito));
              this.tasksService.insertarRegistros(this.tasksService.TABLA_SOLICITUDESNC, registroNotaCredito)
                .then(response => {
                  console.log("guardado INGRESO Exitoso");
                  let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: 'Solicitud de Nota de credito Guardado Exitosamente.', //'+this.SECUENCIARECIBO+'
                    buttons: ["Aceptar"]
                  });
                  alert.present();
                })
                .catch( error => {
                  console.error( error );
                });
              //*************************************
              //this.enviarNotaCreditoMBW(this.filtro_empresa,this.idtiponcSel,this.beanSeguridad.fechaActual().substring(0, 10),this.beanSeguridad.USUARIO_LOGONEADO,this.codigo_cliente,listaAplicados);
              //Retorno a Pantalla Principal de Cobranzas
              this.listaDocumentosAcum.data = [];
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

  /** EDITA EL VALOR DE DEVOLUCION */
  editarDevolucion(item:any){
    console.log("Editar Devolucion==> "+item.id);
    var cadenaDocumento = JSON.parse(item.id);
    //var cadenaDocumento = JSON.stringify(item.id)
    var FECHAREGISTRO = cadenaDocumento.FECHAREGISTRO;

    //for (let i = 0; i < cadenaDocumento.length; i++) {
    var ARTICULO = cadenaDocumento.ARTICULO.split('-')[0];
    var CODARTICULO = cadenaDocumento.CODARTICULO;
    var NUMCMPRVENTA = cadenaDocumento.NUMCMPRVENTA;
    var NUMDOCUMENTO = cadenaDocumento.NUMDOCUMENTO;
    var PRECIO = cadenaDocumento.PRECIO;
    var PORCDESCUENTO = cadenaDocumento.PORCDESCUENTO;
    var DESCUENTO = cadenaDocumento.DESCUENTO;
    var CANTIDAD = cadenaDocumento.CANTIDAD;
    var SUBTOTAL = cadenaDocumento.SUBTOTAL;
    var IMPUESTO = cadenaDocumento.IMPUESTO;
    var TOTAL = cadenaDocumento.TOTAL;
    var CANTIDADDEVUELTA = cadenaDocumento.CANTIDADDEVUELTA;
    var NUMCMPRVENTADET = cadenaDocumento.NUMCMPRVENTADET;
    //}

    //console.log("DEVOLUCIONDATOS: -> "+cadenaDocumento)
    //Validaciones Generales
    let totalFormasPago  = 1;//+parseFloat(this.TOTAL_FPAGOS.replace(",","")).toFixed(2) * 1;
    let saldoDocumento  = 10;//+parseFloat(cadenaDocumento.VALORSALDO.replace(",","")).toFixed(2) * 1;
    let valorXAplicar  = 1;//+parseFloat(cadenaDocumento.VALORXAPLICAR.replace(",","")).toFixed(2) * 1;

    /*if(valorXAplicar <= 0){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El valor aplicado al Documento es $0.00 por tanto no se puede modificar.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }*/

    //Pantalla de Modificacion del Abono
    let alert = this.alertCtrl.create({
      title: 'Cant. Devolver',
      inputs: [ {  name: 'valor', placeholder: CANTIDAD, type: 'number' } ],
      buttons: [
        {
          text: 'Aplicar',
          handler: data => {
            console.log('Aplicar clicked');

            if( parseInt(data.valor) > CANTIDAD){
              let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: 'Error ==> La cantidad a devolver no puede ser mayor a la cantidad facturada '+CANTIDAD,
                buttons: ["Aceptar"]
              });
              alert.present();
              return false;
            }

            //Actualiza Valores en la Lista
            let detallesDocumentos = this.listaDocumentos.data;
            this.listaDocumentos.data = [];
            console.log("ARTICULO-->"+ARTICULO);
            for (let i = 0; i < detallesDocumentos.length; i++) {
              if(detallesDocumentos[i].NUMCMPRVENTA ==  NUMCMPRVENTA && detallesDocumentos[i].ARTICULO.split('-')[0] == ARTICULO && detallesDocumentos[i].NUMCMPRVENTADET == NUMCMPRVENTADET) {
                detallesDocumentos[i].CANTIDADDEVUELTA = data.valor;
                detallesDocumentos[i].BLOQUEADO = "S";
                this.listaDocumentosAcum.data.push(detallesDocumentos[i]);
              }
              //console.log("REGISTRO MODIFICADO"+JSON.stringify(detallesDocumentos[i]));
              this.listaDocumentos.data.push(detallesDocumentos[i]);
              //console.log("listaNormal==>"+JSON.stringify(this.listaDocumentos.data));

              /*if (this.listaDocumentos.data.length > 0){
                this.listaDocumentosAcum.data.push(detallesDocumentos[i]);
                console.log("listaAcumulada==>"+JSON.stringify(this.listaDocumentos.data));
              }*/
            }
            console.log("listaAcumulada==>"+JSON.stringify(this.listaDocumentosAcum.data));
            console.log("listaNormal==>"+JSON.stringify(this.listaDocumentos.data));
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
  //this.filtro_empresa,this.idtiponcSel,this.beanSeguridad.fechaActual().substring(0, 10),this.beanSeguridad.USUARIO_LOGONEADO,this.codigo_cliente,listaAplicados);
  enviarNotaCreditoMBW(empresa,tipnotacredito,fecha,usuario,codcliente,detallesnc ){
    console.log("enviarNotaCredito...");

    //*********************************************************************

    return new Promise((resolve, reject) => {


      let parametroWS:any;
      let respuestaWS:any;
      parametroWS = {codEmpresa: empresa,tipoNotaCredito: tipnotacredito,fechanc: fecha,codusuario: usuario,codCliente:codcliente,detallesncaplicados: detallesnc}


      let loading = this.loadingCtrl.create({ content: 'Enviando Información... <br><b>Por favor espere...</b>' });
      loading.present();
      //parametroWS="{"+"\"success\":"+ "\"true\"}";
      this.beanSeguridad.obtenerInformacionWS("GUARDAR_NOTACREDITO", parametroWS)
        .then(data => {
          respuestaWS = data;

          if(respuestaWS.exito == "true"){
            //Cambia el estado del Cobro
            //alert("RESPUESTA DEL SERVLET");
            return;
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

  selecionarTodos(){

    if (this.marcartodos) {
      console.log("Seleccionar todos==> "+JSON.stringify(this.listaDocumentos.data));
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'Se va a seleccionar todos los articulos de la factura ',
        buttons: ["Aceptar"]
      });
      alert.present();

      //

      let detallesDocumentos = this.listaDocumentos.data;
      console.log("detalleDocumentos->"+JSON.stringify(detallesDocumentos));
      this.listaDocumentos.data = [];
      for (let i = 0; i < detallesDocumentos.length; i++) {
        console.log("DataOrigenDevuelta->"+detallesDocumentos[i].CANTIDADDEVUELTA+"***"+"DataAmodificar->"+detallesDocumentos[i].cantidad);
        detallesDocumentos[i].CANTIDADDEVUELTA = detallesDocumentos[i].CANTIDAD;
        detallesDocumentos[i].BLOQUEADO = "S";
        console.log("RegistroInsertado->"+JSON.stringify(detallesDocumentos[i]));
        this.listaDocumentosAcum.data.push(detallesDocumentos[i]);
        this.listaDocumentos.data.push(detallesDocumentos[i]);
      }
      console.log("listaAcumuladaChecked==>"+JSON.stringify(this.listaDocumentosAcum.data));
      console.log("listaNormalChecked==>"+JSON.stringify(this.listaDocumentos.data));


    }else{
      let detallesDocumentos = this.listaDocumentos.data;
      this.listaDocumentos.data = [];
      for (let i = 0; i < detallesDocumentos.length; i++) {
        detallesDocumentos[i].CANTIDADDEVUELTA = "";
        detallesDocumentos[i].BLOQUEADO = "N";
        this.listaDocumentos.data.push(detallesDocumentos[i]);

        console.log("listaAcumuladaUnchecked==>"+JSON.stringify(this.listaDocumentosAcum.data));
        console.log("listaNormalUnchecked==>"+JSON.stringify(this.listaDocumentos.data));
      }


    }
    this.cargarListaDocumentos();

  }
  ionViewWillLoad(){
    //this.inicializarComponentes();
    console.log('ionViewDidLoad SaldonotascreditoPage');
  }

}
