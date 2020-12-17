import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BeanSeguridad } from '../../providers/seguridad/seguridadApp';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the RepcomisionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repcomisiones',
  templateUrl: 'repcomisiones.html',
})
export class RepcomisionesPage {

  theHtmlString:any;
  listaEmpresas:any;
  selectedItem: any;
  lista: Array<{name: string, letter:boolean}>;
  empresas: Array<{ value: string, text: string }> = [];
  empresa: any;
  nombre_empresa:any;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController, 
              public beanSeguridad: BeanSeguridad,
              public alertCtrl: AlertController,
              public http: HttpClient) {

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
  }

  onSelectChange(item:any) {
    this.empresa = item.value.trim();
    this.nombre_empresa = item.text.trim();
  }

  //Obtiene el Reporte a Visualizar
  obtenerInformacion(){
    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present();
    //-------------------------------------------------------------
    return new Promise((resolve, reject) => {
      let respuestaWS:any;
      let parametroWS = {EMPRESA: this.empresa};
                     
      this.beanSeguridad.obtenerInformacionWS("REPORTE_COMISIONES", parametroWS)
      .then(data => {
          respuestaWS = data;
          //Cierra Espera
          loading.dismiss();

          if(respuestaWS.exito == "true"){
            console.log('url: '+this.beanSeguridad.urlServicioReportes+respuestaWS.url); //encodeURIComponent(
//            window.open( this.beanSeguridad.urlServicioReportes + respuestaWS.url,'_blank', 'location=yes');
              //this.theHtmlString = window.open( this.beanSeguridad.urlServicioReportes + respuestaWS.url,'_blank', 'location=yes');
              let URL_Data = this.http.get(this.beanSeguridad.urlServicioReportes + respuestaWS.url);
              this.theHtmlString = URL_Data.toString();
/*
              this.http.get(this.beanSeguridad.urlServicioReportes + respuestaWS.url).subscribe(response => {
                this.theHtmlString = response.toString();
                console.log('theHtmlString: '+this.theHtmlString);
        
                //asynchronous method converting the returned Observable
                //(http.get returns Observable) and setting it to the message property.
            });*/

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

          //termina proceso
          resolve();
      })
      .catch( error => {
        console.log("ERROR ==> " + JSON.stringify(error.json()));
        
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
    //-----------------------------------------------------------------------
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RepcomisionesPage');
  }

}
