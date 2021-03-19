import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {  ModalController } from 'ionic-angular';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import {SaldosclientesPage} from "../saldosclientes/saldosclientes";
import {SaldonotascreditoPage} from "../saldonotascredito/saldonotascredito";

/**
 * Generated class for the NotasdecreditoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notasdecredito',
  templateUrl: 'notasdecredito.html',
})
export class NotasdecreditoPage {

  listaEmpresas:any;
  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;
  empresas: Array<{ value: string, text: string }> = [];
  filtro_empresa = null;
  filtro_cliente = null;
  nombre_empresa = null;
  filtro_item = null;

  //--

  icons: string[];
  items: Array<{title: string, note: string, note2: string }>;
  itemsRespaldo: Array<{title: string, note: string, note2: string }>;

  itemsArticulos: Array<{title: string, note: string, note2: string }>;
  itemsRespaldoAr: Array<{title: string, note: string, note2: string }>;

  displayProperty: string;
  title: string;
  fdesde: any;
  fhasta: any;
  empresa: any;

  idmodulonc = "";
  modulosnc: Array<{ value: string, text: string }> = [];
  registro:any = null;
  listamodulosNC:any;

  idtiposcn = "";
  listatiposnc: any;
  tiposnc: Array<{ value: string, text: string }> = [];
  seltiposnc:any;

  moduloSeleccionado:any;
  tipoSeleccionado: any;

  constructor(public navCtrl: ViewController,
              public navCtrl_Pages: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController,
              public tasksService: TasksServiceProvider
              ) {


    /*this.fdesde = this.beanSeguridad.fechaActual().substring(0,10);
    this.fhasta = this.beanSeguridad.fechaActual().substring(0,10);*/

    //********** Obtencion de las Empresas *********************
    //09032021
    this.empresa = navParams.get('empresa');
    this.nombre_empresa = navParams.get('nombre_empresa');
    /*this.listaEmpresas = JSON.parse(beanSeguridad.EMPRESAS);
    for (let i = 0; i < this.listaEmpresas.length; i++) {
      this.empresas.push({value: this.listaEmpresas[i].empresa, text: this.listaEmpresas[i].nombre});
      //Asigna la primera empresa
      if (this.empresa == null) {
        this.empresa = this.listaEmpresas[i].empresa;
        this.nombre_empresa = this.listaEmpresas[i].nombre;
      }
    }*/
    //this.obtenerInformacion();

    let loading = this.loadingCtrl.create({content: 'Actualizando Información... <br><b>Por favor espere...</b>'});
    loading.present().then(() => {
      return new Promise((resolve, reject) => {

        tasksService.obtenerParametro("MODULOSNC")
          .then(tasks => {
            //console.log(tasks);
            this.registro = tasks[0];

            var cadenaJSON = "" + this.registro.VALOR;
            console.log("valor ==> " + cadenaJSON);

            this.listamodulosNC = JSON.parse(cadenaJSON);
            for (let i = 0; i < this.listamodulosNC.length; i++) {

              this.modulosnc.push({value: this.listamodulosNC[i].codigo, text: this.listamodulosNC[i].descripcion});

              //Asigna la primera
              //if(i == 0){ this.modulosnc = this.listamodulosNC[i].codigo; this.modulosnc =  this.listamodulosNC[i].descripcion; }
            }

            //Retorno Respuesta
            resolve(this.listamodulosNC);
          })
          .catch(error => {
            console.error("ERROR ==> " + error);
            reject(error.json());
            //Mensaje Wait.......
          });
      })
    })

      /*__________________________________________________________________________________*/
      .then(() => {
        return new Promise((resolve, reject) => {

          tasksService.obtenerParametro("TIPOSNC")
            .then(tasks => {
              //console.log(tasks);
              this.registro = tasks[0];

              var cadenaJSON = "" + this.registro.VALOR;
              console.log("valor ==> " + cadenaJSON);

              this.listatiposnc = JSON.parse(cadenaJSON);

              for (let i = 0; i < this.listatiposnc.length; i++) {

                this.tiposnc.push({value: this.listatiposnc[i].modulo, text: this.listatiposnc[i].descripcion});

                //Asigna la primera
                //if(i == 0){ this.modulosnc = this.listamodulosNC[i].codigo; this.modulosnc =  this.listamodulosNC[i].descripcion; }
              }

              //Retorno Respuesta
              console.log("Valores TIPOSNC===>"+ JSON.stringify(this.listatiposnc));
              resolve(this.listatiposnc);
            })
            .catch(error => {
              console.error("ERROR ==> " + error);
              reject(error.json());
              //Mensaje Wait.......
            });
        })
      })

      .then(() => loading.dismiss());
  }
  /*---------------------------------------------------------------*/
  onSelectChange(item:any, tipo:string) {
    console.log("onSelectChange-->"+item);
    if(tipo == "EMP"){
      this.empresa = item.value.trim();
      this.nombre_empresa = item.text.trim();
      console.log("CAMBIAEMPRESA-->"+this.nombre_empresa);
    }

    //Re-leer el Grid Principal
    //this.obtenerInformacion();
  }

  /*---------------------------------------------------------------*/

  /**---------------------------------------------------------------*/
  //VTAMA 11-01-2021
  //Realiza la Busqueda de Clientes para NOTA DE CREDITO
  buscarClienteNotaCredito(itemtipos) {
    if (!this.moduloSeleccionado){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'Debe seleccionar el modulo que al que corresponde la nota de credito.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }
    this.tipoSeleccionado = itemtipos;
    if (!this.tipoSeleccionado){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El tipo de nota de credito es obligatorio.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }



    console.log("buscando cliente nota de credito...");
    this.filtro_empresa = this.empresa;

    //Filtro Cliente - Obligatorio
    if(this.filtro_cliente == null || "" == this.filtro_cliente){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El Filtro de Cliente es necesario, por favor ingrese un valor válido.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present()
      .then(() =>{
        //Obtengo la Informacion Requerida
        var cadenaSaldos="";
        this.items = [];
        var campo2 = "CAMPO2";
        var campo3 = "CAMPO3";

        this.tasksService.obtenerClientesNotaCredito({empresa:this.filtro_empresa, cliente:this.filtro_cliente})
          .then(data => {

            //Carga de los registros
            console.log("ClienteNCregistros: "+ JSON.stringify(data) );
            for (let i = 0; i < data.length; i++) {
              cadenaSaldos =  " • TIPO CLIENTE : "+ data[i].TIPOCLIENTE; //+                              " • VENDEDOR     : "+ data[i].VENDEDOR;

              //Inserta el Registroa a Pantalla

              //console.log("DATO CLIENTE: "+data[i].DATOS_CLIENTE);

              campo2 = data[i].DATOS_CLIENTE.split('-')[1];
              campo3 = data[i].DATOS_CLIENTE.split('-')[2];
              //console.log("CAMPO2<<"+campo2+">>||<<"+"CAMPO3<<"+campo3+">>");
              this.items.push({title:data[i].CODCLIENTE +" - "+campo3, note: " • RUC: " +campo2, note2: cadenaSaldos});
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

  /*---------------------------------------------------------------*/
  //VTAMA 11-01-2021
  //Realiza la Busqueda de Clientes para NOTA DE CREDITO
  buscarItemdevolver() {

    console.log("buscando items asociados al cliente ...");
    this.filtro_empresa = this.empresa;

    //Filtro Cliente - Obligatorio
    if(this.filtro_cliente == null || "" == this.filtro_cliente){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El Filtro de Cliente es necesario, por favor ingrese un valor válido.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }

    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present()
      .then(() =>{
        //Obtengo la Informacion Requerida
        var cadenaSaldos="";
        this.itemsArticulos = [];
        var campo2 = "CAMPO2";
        var campo3 = "CAMPO3";

        this.tasksService.obtenerItemDevolucion({empresa:this.filtro_empresa, cliente:this.filtro_cliente})
          .then(data => {

            //Carga de los registros
            console.log("ClienteNCregistros: "+ JSON.stringify(data) );
            for (let i = 0; i < data.length; i++) {
              cadenaSaldos =  " • TIPO CLIENTE : "+ data[i].TIPOCLIENTE +
                " • VENDEDOR     : "+ data[i].VENDEDOR;

              //Inserta el Registroa a Pantalla

              console.log("DATO CLIENTE: "+data[i].DATOS_CLIENTE);

              campo2 = data[i].DATOS_CLIENTE.split('-')[1];
              campo3 = data[i].DATOS_CLIENTE.split('-')[2];
              console.log("CAMPO2<<"+campo2+">>||<<"+"CAMPO3<<"+campo3+">>");
              this.itemsArticulos.push({title:data[i].CODCLIENTE +" - "+campo3, note: " • RUC: " +campo2, note2: cadenaSaldos});
            }
            //Respaldo para la Busqueda por Filtro
            this.itemsRespaldoAr = this.itemsArticulos;

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

  /*---------------------------------------------------------------*/

  initializeItems() {
    //this.items = this.navParams.get('item');
    this.items = this.itemsRespaldo;
  }

  /*---------------------------------------------------------------*/

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

  /*---------------------------------------------------------------*/
  //VTAMA
  //12-01-2021
  buscarTipoNC(item){
    //console.log("ENTRA A LA FUNCION buscarTipoNC parametro -->>"+ item);
    this.moduloSeleccionado = item;
    this.tiposnc = [];
    var datval = "MMMM";
    var codTiponc = null;
    var descTiponc = null;
    for (let k=0; k < this.listatiposnc.length; k++){
        var imodulo =this.listatiposnc[k].modulo;
        datval = item.toString();

      if(imodulo == datval){
        codTiponc = this.listatiposnc[k].descripcion.split('-')[0];
        descTiponc = this.listatiposnc[k].descripcion.split('-')[1];
        this.tiposnc.push({value:codTiponc,text:descTiponc});
      }
    }

    //this.asignartipoNC();
  }
  /*______________________________________________________________*/
  /*asignartipoNC(){
    this.seltiposnc="";
    console.log("OpcionesSeleccionadas:>>"+JSON.stringify(this.tiposnc));
    for (let k=0; k < this.tiposnc.length; k++){
      console.log("modulo"+this.tiposnc[k].value+"<> desc"+this.tiposnc[k].text);
      this.seltiposnc.push({value:this.tiposnc[k].value,text:this.tiposnc[k].text});
    }
    console.log("Salida-->"+JSON.stringify(this.seltiposnc));
  }*/
  /*______________________________________________________________*/
  //VTAMA
  //Enlaza a la Pantalla de Visualizacion de Saldos
  verSaldos(item){
    console.log("MODULOSELECCIONADO==> "+this.moduloSeleccionado.value+" TIPONCELECCIONADO==> "+this.tipoSeleccionado.value);
    let parametros = {empresa:this.filtro_empresa, cliente:item.title, saldos:item.note, saldos1:item.note2, nombre_empresa: this.nombre_empresa, nuevo: 'S',modulo:this.moduloSeleccionado.value, tiponc:this.tipoSeleccionado.value};
    console.log("ParametrosEnviadosSaldosclientesPage==>"+JSON.stringify(parametros));
    this.navCtrl_Pages.push(SaldosclientesPage,parametros);
  }



  /*---------------------------------------------------------------*/
  //Enlaza a la pantalla de Pagos Nuevos
  iniciarNC(item){

    //Si es Nuevo - Y ya esta cerrado el dia
    let fechaActual:string = this.beanSeguridad.fechaActual().substring(0, 10);
    /*this.tasksService.obtenerCierreCobranzas(this.filtro_empresa, fechaActual)
      .then(data => {
        //console.log("data ==> "+JSON.stringify(data));
        if(data.length > 0 && data[0].BANCO == "S"){
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: 'El Dia Actual '+fechaActual+' ya fue cerrado, no se puede ingresar mas cobros.',
            buttons: ["Aceptar"]
          });
          alert.present();
          return;
        }
        else
        {
          //Verifica si existe cierres pendientes
          this.tasksService.obtenerCierresPendientes(this.filtro_empresa, fechaActual)
            .then(data => {
              if(data.length > 0){
                let alert = this.alertCtrl.create({
                  title: 'Atención',
                  subTitle: 'El Dia: <b>'+data[0].IDCIERRE+'</b> no ha sido cerrado, no se puede ingresar cobros.',
                  buttons: ["Aceptar"]
                });
                alert.present();
                return;
              }else{*/
                //Mensaje de Confirmacion del Pago
                let confirm = this.alertCtrl.create({
                  title: 'Atención',
                  message: '¿Está Seguro de Realizar nota de crédito al Cliente: <b>'+item.title+"</b>?",
                  buttons: [
                    {
                      text: 'Si',
                      handler: () => {
                        console.log('Yes selected');
                        console.log("empresa:->"+this.filtro_empresa+", nombre_empresa:-> "+this.nombre_empresa+", cliente:->"+item.title);
                        console.log("MODULOSELECCIONADO:->"+this.moduloSeleccionado+", TIPONCELECCIONADO:-> "+this.tipoSeleccionado);
                        let parametros = {empresa:this.filtro_empresa, nombre_empresa: this.nombre_empresa, cliente:item.title,  nuevo: 'S',modulo:this.moduloSeleccionado, tiponc:this.tipoSeleccionado};
                        console.log("ParametrosEnviados==>"+JSON.stringify(parametros));
                        this.navCtrl_Pages.push(SaldonotascreditoPage,parametros);
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
            /*});
        }
      });
  }*/



  /**_______________________________________________________________*/

  formatNumber(valor:any, decimales:number){
    return new Intl.NumberFormat('en-us', {minimumFractionDigits: decimales}).format(valor);
  }

  ionViewDidLoad(){
    console.log('ionViewDidLoad NotasdecreditoPage');
  }

}
