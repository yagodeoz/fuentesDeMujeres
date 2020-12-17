import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';

/**
 * Generated class for the SaldosclientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saldosclientes',
  templateUrl: 'saldosclientes.html',
})
export class SaldosclientesPage {

  filtro_empresa = null;
  filtro_cliente = null;
  nombre_empresa = null;
  saldos  = null;
  saldos1  = null;

  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;

  icons: string[];
  items: Array<{title: string, 
                vendedor:string, 
                saldo_documento:string, 
                fecha: string, 
                dias: string, 
                referencia: string, 
                valor_cheque:string, 
                saldo_final:string,
                valor_aplicar: string }>; 

  itemsRespaldo: Array<{title: string, 
                        vendedor:string, 
                        saldo_documento:string, 
                        fecha: string, 
                        dias: string, 
                        referencia: string, 
                        valor_cheque:string, 
                        saldo_final:string,
                        valor_aplicar: string }>;
  fdesde: any;
  fhasta: any;
  displayProperty: string;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public tasksService: TasksServiceProvider,
              public beanSeguridad: BeanSeguridad,
              public loadingCtrl: LoadingController) {

      // If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = navParams.get('item');
      this.displayProperty = navParams.get('displayProperty');

      this.filtro_empresa = navParams.get('empresa');
      this.filtro_cliente = navParams.get('cliente');
      this.nombre_empresa = navParams.get('nombre_empresa');
      this.saldos = navParams.get('saldos');
      this.saldos1 = navParams.get('saldos1');
  }

  initializeItems() {
    this.items = this.itemsRespaldo;
  }
  /*
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
  }*/

  //Realiza la Busqueda de Clientes 
  buscarECCliente() {

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
        this.items = [];
        this.tasksService.obtenerEstadoCuentaXCliente({empresa:this.filtro_empresa, cliente:this.filtro_cliente.split('-')[0].trim()})
        .then(data => {

          //Carga de los registros
          //{title:"FAC # 001-002-000055814", fecha: "01/01/2018 ", dias:"146", cheque:"100.00", saldo:"1550.00" },
          for (let i = 0; i < data.length; i++) {
            //Inserta el Registroa a Pantalla
            this.items.push({title: data[i].NUMDOCUMENTO, 
                             vendedor: data[i].VENDEDOR, 
                             saldo_documento:data[i].VALORCUOTA, 
                             fecha: data[i].FECHAEMISION, 
                             dias: data[i].DIASFEMISION, 
                             referencia: data[i].REFERENCIA, 
                             valor_cheque: ("0.00" == data[i].VALORCHEQUE ? "-" : "$ "+data[i].VALORCHEQUE), 
                             saldo_final:data[i].VALORSALDO,
                             valor_aplicar: data[i].VALORXAPLICAR});
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
    //console.log("verSaldos..."+this.filtro_empresa+" ==> "+item.title);
  }

  //Enlaza a la pantalla de Pagos Nuevos
  iniciarPago(item){    

    //Mensaje de Confirmacion del Pago
      let confirm = this.alertCtrl.create({
        title: 'Atención',
        message: '¿Está Seguro de Realizar un Pago al Documento: '+item.title+"?",
        buttons: [
          {
            text: 'Si',
            handler: () => {
              console.log('Yes selected');
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
    console.log('ionViewDidLoad SaldosclientesPage');
    this.buscarECCliente();
  }

}
