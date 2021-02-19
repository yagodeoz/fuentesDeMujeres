import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SaldosclientesPage } from '../saldosclientes/saldosclientes';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { CobroclientePage } from '../cobrocliente/cobrocliente';

/**
 * Generated class for the NuevacobranzaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nuevacobranza',
  templateUrl: 'nuevacobranza.html',
})
export class NuevacobranzaPage {

  filtro_empresa = null;
  filtro_cliente = null;
  nombre_empresa = null;

  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;

  icons: string[];
  items: Array<{title: string, note: string, note2: string }>;
  itemsRespaldo: Array<{title: string, note: string, note2: string }>;
  fdesde: any;
  fhasta: any;
  displayProperty: string;
  title: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public tasksService: TasksServiceProvider,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController) {

      this.filtro_empresa = navParams.get("empresa");

      // If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = navParams.get('item');
      this.displayProperty = navParams.get('displayProperty');
      //this.title = navParams.get('title');
      //if(!this.title) this.title = 'Select...';

      this.filtro_empresa = navParams.get('empresa');
      this.nombre_empresa = navParams.get('nombre_empresa');
  }

  initializeItems() {
    //this.items = this.navParams.get('item');
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
        // console.log(item.title);
        return ((item.title.toLowerCase()+""+item.note.toLowerCase()).indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  //Realiza la Busqueda de Clientes
  buscarCliente() {

      console.log("buscando...");

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
          this.tasksService.obtenerCarteraClientes({empresa:this.filtro_empresa, cliente:this.filtro_cliente})
          .then(data => {

            //Carga de los registros
            for (let i = 0; i < data.length; i++) {
              //Genera la cadena de saldos
              cadenaSaldos =  " • VENCIDO: $"+ data[i].VENCIDO +
                              " • X VENCER: $" + data[i].XVENCER; /*+
                              " • A FAVOR: $" + data[i].AFAVOR +
                              " • TOTAL: $" + data[i].TOTAL;*/

              //Inserta el Registroa a Pantalla
              this.items.push({title:data[i].CODCLIENTE+" - "+data[i].NOMBRECLIENTE, note: cadenaSaldos, note2:" • A FAVOR: $" + data[i].AFAVOR + " • TOTAL: $" + data[i].TOTAL });
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


  //Enlaza a la Pantalla de Visualizacion de Saldos
  verSaldos(item){
    //console.log("verSaldos..."+this.empresa+" ==> "+item.title);
    let parametros = {empresa:this.filtro_empresa, cliente:item.title, saldos:item.note, saldos1:item.note2, nombre_empresa: this.nombre_empresa};
    this.navCtrl.push(SaldosclientesPage,parametros);
  }

  //Enlaza a la pantalla de Pagos Nuevos
  iniciarPago(item){

      //Si es Nuevo - Y ya esta cerrado el dia
      let fechaActual:string = this.beanSeguridad.fechaActual().substring(0, 10);
      this.tasksService.obtenerCierreCobranzas(this.filtro_empresa, fechaActual)
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
              }else{
                //Mensaje de Confirmacion del Pago
                let confirm = this.alertCtrl.create({
                  title: 'Atención',
                  message: '¿Está Seguro de Realizar un Pago al Cliente: <b>'+item.title+"</b>?",
                  buttons: [
                    {
                      text: 'Si',
                      handler: () => {
                        //console.log('Yes selected');
                        let parametros = {empresa:this.filtro_empresa, nombre_empresa: this.nombre_empresa, cliente:item.title, saldos:item.note, nuevo: 'S'};
                        this.navCtrl.push(CobroclientePage,parametros);
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
          });
        }
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevacobranzaPage');
    //this.buscarCliente();
  }

}
