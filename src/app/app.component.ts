import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PrincipalcobranzaPage } from '../pages/principalcobranza/principalcobranza';
import { SQLite } from '@ionic-native/sqlite';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';
import { RepcomisionesPage } from '../pages/repcomisiones/repcomisiones';
import { BeanSeguridad } from '../providers/seguridad/seguridadApp';
import { NotasdecreditoPage} from '../pages/notasdecredito/notasdecredito';
import { PrincipalnotasdecreditoPage} from "../pages/principalnotasdecredito/principalnotasdecredito";

@Component({
  templateUrl: 'app.html',
  providers: []
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any, icon: string, id: string}>;
  //Mensaje Falta Actualizacion
  alertActualizacion = this.alertCtrl.create({title: 'Atención', subTitle: 'El Sistema necesita ser Actualizado antes de empezar su operación.', buttons: ["Aceptar"] });

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public tasksService: TasksServiceProvider,
              public sqlite: SQLite,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public beanSeguridad: BeanSeguridad) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    //VTAMA *se agrega componente para el menu de cota de credito*
    this.pages = [
     // { title: 'Inicio', component: null, icon:"home", id:"0"},
     // { title: 'Pedidos', component: PrincipalcobranzaPage, icon:"cart", id:"1" },
      { title: 'Cobranzas', component: PrincipalcobranzaPage, icon:"calculator", id:"2" },
      { title: 'Rep. Cumplimiento', component: RepcomisionesPage, icon:"podium", id:"3" },
      { title: 'Actualizar Inform.', component: null, icon:"refresh", id:"4" },
      //{ title: 'Generar nota credito',component:NotasdecreditoPage,icon:"archive",id:"5"}
      { title: 'Generar nota credito',component: PrincipalnotasdecreditoPage,icon:"archive",id:"5"}
      //{ title: 'Salir', component: ListPage, icon:"log-out", id:"10" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Metodo para cerrar la pantalla de Espera
      this.hideSplashScreen();

      this.createDatabase();
    });
  }

  //Metodo Seleccion de Menu
  openPage(page) {

    //Validacion de actualizacion  Diaria
    var fechaActualizacion = this.beanSeguridad.FECHASINCRONIZADO || null;
    if((fechaActualizacion == null || "" == fechaActualizacion.trim()) && page.id != "4"){//VTAMA ORIGINALMENTE VA 4 SE CAMBIA POR PRUEBAS A 5
    //if(page.id!= "4" || page.id!="5"){
      let alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: 'El Sistema necesita que se Actualice su Información antes de empezar su operación.',
        buttons: ["Aceptar"]
      });
      alert.present();
      return;
    }

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.id == "1") { //Pedidos
      //this.nav.popToRoot();
    }else if (page.id == "3") { //Reporte Cumplimiento
      this.verReporteCumplimiento();
    }else if (page.id == "4") { //Actualizar App
      this.beanSeguridad.actualizarApp();
    //}else if (page.id == "10") { //Salir
    //  this.salirApp();
    } else {
      this.nav.push(page.component);
    }
  }

  //Cierra Pantalla al cargar el Login
  hideSplashScreen() {
    console.log('==> '+this.splashScreen)
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    }
  }

  inicioApp(){
    this.nav.popToRoot();
  }

   //Obtiene el Reporte a Visualizar
   verReporteCumplimiento(){
    let loading = this.loadingCtrl.create({ content: 'Obteniendo Información... <br><b>Por favor espere...</b>' });
    loading.present();
    //-------------------------------------------------------------
    return new Promise((resolve, reject) => {
      let respuestaWS:any;
      let parametroWS = {EMPRESA: '1'};
      this.beanSeguridad.obtenerInformacionWS("REPORTE_COMISIONES", parametroWS)
      .then(data => {
          respuestaWS = data;
          //Cierra Espera
          loading.dismiss();

          if(respuestaWS.exito == "true"){
            console.log('url: '+this.beanSeguridad.urlServicioReportes+respuestaWS.url); //encodeURIComponent(
           window.open( this.beanSeguridad.urlServicioReportes + respuestaWS.url,'_blank', 'location=no'); //location=yes (Ver URL)

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
            this.platform.exitApp();
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

  //Crear Base de Datos Aplicativo
  private createDatabase(){
    this.sqlite.create({
      name: 'cobranzasdmsa.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.tasksService.setDatabase(db);
      return this.tasksService.inicializarBaseDatos();
    })
    .then(() =>{
      this.splashScreen.hide();
      this.rootPage = 'HomePage';
    })
    .catch(error =>{
      console.error(error);
    });
  }

}
