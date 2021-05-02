import {Component} from '@angular/core';

import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BeanSeguridad} from '../../providers/seguridad/seguridadApp';
import {TasksServiceProvider} from '../../providers/tasks-service/tasks-service';
import {HomePage} from '../home/home';
import {AppUpdate} from '@ionic-native/app-update';
import * as moment from 'moment';

//import { AppVersion } from '@ionic-native/app-version/ngx';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'//,
  // providers: [SoapService]
})
export class LoginPage {
  data: any = {};
  tasks: any[] = [];
  respuestaLogin: any = null;
  registro: any = {};

  registrodos: any = {};
  //18032021
  registronc: any = null;
  sincronc: any = null;
  tasksdos: any[] = [];
  public tmpfechasincro: string = "";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public beanSeguridad: BeanSeguridad,
    public tasksService: TasksServiceProvider,
    private appUpdate: AppUpdate
    //public appVersion: AppVersion
  ) {

    //Valida si existe actualizacion de la APP
    //const updateUrl = beanSeguridad.urlUpdateXML;
    //this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('Update available') });
    //*****************************************

    this.data.response = '';
    this.myForm = this.formBuilder.group({
      usuario: ['', Validators.nullValidator],
      password: ['', Validators.required]
    });

    //Inicializar Variables Globales - DEFAULT
    beanSeguridad.NOMBRE_USUARIO = "-"
    beanSeguridad.USUARIO_LOGONEADO = "-";
    beanSeguridad.EN_LINEA = false;
    beanSeguridad.SINCRONIZADO = false;
    beanSeguridad.banPrivez = false;

  }

  myForm: FormGroup;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  loginUser() {

    console.log("Email:" + this.myForm.value.usuario);
    console.log("Password:" + this.myForm.value.password);

    let loading = this.loadingCtrl.create({content: 'Por favor espere...'});
    loading.present();

    this.data.username = this.myForm.value.usuario.toLowerCase();
    this.data.password = this.myForm.value.password;
    this.data.response = '';

    let isAccesoCorrecto = false;
    let fechaActual = this.beanSeguridad.fechaActual().substring(0, 10);
    this.tasksService.verificaAccesoUsuario(this.data.username, this.data.password, fechaActual)
      .then(tasks => {
        //console.log(tasks);
        this.tasks = tasks;

        console.log("Usuario Encontrado ==> " + (this.tasks.length > 0));
        if (this.tasks.length > 0) {
          isAccesoCorrecto = true;

          //Asignacion Clase General Sesion
          this.beanSeguridad.NOMBRE_USUARIO = this.tasks[0].NOMBRE;
          this.beanSeguridad.USUARIO_LOGONEADO = this.tasks[0].CODUSUARIO;
          this.beanSeguridad.EN_LINEA = false;
          this.beanSeguridad.SINCRONIZADO = true; //OJO - Cambiar a TRUE
          this.beanSeguridad.FECHASINCRONIZADO = this.tasks[0].ULTIMAACTUALIZACION;
          this.beanSeguridad.EMPRESAS = this.tasks[0].CLIENTESTODOS;


          this.tasksService.obtenerFechaSincroNC(this.beanSeguridad.USUARIO_LOGONEADO)
            .then(fechasincro => {
              this.sincronc = fechasincro[0];
              var fechaultsincronc = "" + this.sincronc.fechaSincro;
              console.log("FECHARETORNAloginUser-->" + fechaultsincronc);
              this.beanSeguridad.FECHASINCRONIZADONC = fechaultsincronc;
              ///
              console.log("PARAMETRO DE BUSQEUDA FECHA TABLET " + this.beanSeguridad.FECHASINCRONIZADONC);

              this.tasksService.existenRegistros("FACNOTACREDITOCAB")
                .then(existe => {
                  this.registronc = existe[0];

                  var cadenaJSON = "" + this.registronc.VALOR;
                  console.log("CANTIDADREGCABNC ==> " + cadenaJSON);
                  if (cadenaJSON.length > 0) {

                    this.beanSeguridad.banPrivez = true;
                    console.log("ASIGNAbanPrivez ==>" + this.beanSeguridad.banPrivez);
                  }


                  this.navCtrl.setRoot(HomePage, null);

                });
            });

        } else {
          isAccesoCorrecto = false;

          this.validarUsuarioOnLine();

        }

        //Mensaje Wait.......
        loading.dismiss();


      })
      .catch(error => {
        console.error("ERROR ==> " + error);
        //Mensaje Wait.......
        loading.dismiss();

        isAccesoCorrecto = false;
        let alert = this.alertCtrl.create({
          title: 'Atención',
          subTitle: ' Error ==> Existe un error al validar el usuario.',
          buttons: ["Aceptar"]
        });
        alert.present();

        //this.validarUsuarioOnLine();
      });

    console.log("isAccesoCorrecto ==> " + isAccesoCorrecto);
    //Mensaje Wait.......
    loading.dismiss();

  }

  /*validarUsuarioOnLine() {

    //let loading = this.loadingCtrl.create({  content: 'Por favor espere...'});
    //loading.present();

    //console.log("Fecha de sincronizacion : " + fechaSincro);


    this.tasksService.obtenerFechaSincroNC(this.data.username)
      .then(fechasincro => {

        if (fechasincro)
          if(fechasincro.length>0){
            this.sincronc = fechasincro[0];
            let fechaultsincronc = "" + this.sincronc.fechaSincro;
            console.log("FECHARETORNAloginUser-->" + fechaultsincronc);
            this.beanSeguridad.FECHASINCRONIZADONC = fechaultsincronc;
            ///
            console.log("PARAMETRO DE BUSQEUDA FECHA TABLET " + this.beanSeguridad.FECHASINCRONIZADONC);

            this.tasksService.existenRegistros("FACNOTACREDITOCAB")
              .then(existe => {
                this.registronc = existe[0];

                var cadenaJSON = "" + this.registronc.VALOR;
                console.log("valorFACNOTACREDITOCAB ==> " + cadenaJSON);
                if (Number(cadenaJSON) > 0) {
                  this.beanSeguridad.banPrivez = true;
                }


                this.navCtrl.setRoot(HomePage, null);

              });

          }else{
           // this.beanSeguridad.FECHASINCRONIZADONC = "";
            console.log("NO EXISTE FECHA " + this.beanSeguridad.FECHASINCRONIZADONC);
          }




        let respuestaWS: any;
        //let parametroWS = "&codusuario="+this.data.username+"&codclave="+this.data.password;
        let parametroWS = {codusuario: this.data.username, codclave: this.data.password};
        console.log("parametroWS ==> " + parametroWS);

        return new Promise((resolve, reject) => {
          this.beanSeguridad.obtenerInformacionWS("VERIFICAR_USUARIO_WSJSON", parametroWS)
            .then(data => {
              console.log("data validarUsuarioOnLine==> " + JSON.stringify(data));
              respuestaWS = data;

              if ("true" == respuestaWS.exito) {
                //loading.dismiss();
                //Asignacion Clase General Sesion

                this.beanSeguridad.NOMBRE_USUARIO = respuestaWS.nombres;
                this.beanSeguridad.USUARIO_LOGONEADO = respuestaWS.codusuario;
                this.beanSeguridad.EN_LINEA = true;
                this.beanSeguridad.SINCRONIZADO = false;
                this.beanSeguridad.FECHASINCRONIZADO = ""; //respuestaWS.fechasincronizado;
                this.beanSeguridad.EMPRESAS = respuestaWS.empresas;
                //this.beanSeguridad.FECHASINCRONIZADONC = this.beanSeguridad.FECHASINCRONIZADONC;

                console.log("ANTESENVIOINSERT-->" + this.beanSeguridad.FECHASINCRONIZADONC);

                //Actualizar la Base informacion del Vendedor
                this.registro = {};
                this.registro.CODUSUARIO = respuestaWS.codusuario;
                this.registro.NOMBRE = respuestaWS.nombres;
                this.registro.CLAVE = this.data.password;
                this.registro.CLIENTESTODOS = "";
                this.registro.ULTIMAACTUALIZACION = "-------";
                this.registro.CLIENTESTODOS = respuestaWS.empresas;
                //this.registro.FECHAACTNC = moment().format('YYYY-MM-DD h:mm:ss');
                //this.registro.FECHAACTNC = this.beanSeguridad.FECHASINCRONIZADONC;//"------";
                this.tasksService.insertarRegistros(this.tasksService.TABLA_COBUSUARIOS, this.registro)
                  .then(response => {
                    //this.tasks.unshift( data );
                    console.log("guardado Exitoso");



                    //Envio a la nueva pantalla
                    let parametros = {usuario: this.data.username};
                    this.navCtrl.setRoot(HomePage, parametros);


                  })
                  .catch(error => {
                    console.error(error);
                  })

              } else {

                //loading.dismiss();

                let alert = this.alertCtrl.create({
                  title: 'Atención',
                  subTitle: ' Error ==> ' + respuestaWS.mensaje,
                  buttons: ["Aceptar"]
                });
                alert.present();
              }

              //termina proceso
              resolve();

            })
            .catch(error => {

              //loading.dismiss();
              console.log(JSON.stringify(error.json()));

              //Error Comunicacion
              let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error - No existe comunicación con el Servidor ',
                buttons: ["Aceptar"]
              });
              alert.present();

              //termina proceso
              reject(error.json());

            });
        });

      });

  }*/


  validarUsuarioOnLine(){

    //let loading = this.loadingCtrl.create({  content: 'Por favor espere...'});
    //loading.present();

    let respuestaWS:any;
    //let parametroWS = "&codusuario="+this.data.username+"&codclave="+this.data.password;
    let parametroWS = {codusuario:this.data.username, codclave:this.data.password};
    console.log("parametroWS ==> " + parametroWS);

    return new Promise((resolve, reject) => {
      this.beanSeguridad.obtenerInformacionWS("VERIFICAR_USUARIO_WSJSON", parametroWS)
        .then(data => {
          console.log("data ==> "+JSON.stringify(data));
          respuestaWS = data;

          if("true" == respuestaWS.exito){

            //loading.dismiss();

            //Asignacion Clase General Sesion
            this.beanSeguridad.NOMBRE_USUARIO = respuestaWS.nombres;
            this.beanSeguridad.USUARIO_LOGONEADO = respuestaWS.codusuario;
            this.beanSeguridad.EN_LINEA = true;
            this.beanSeguridad.SINCRONIZADO = false;
            this.beanSeguridad.FECHASINCRONIZADO = ""; //respuestaWS.fechasincronizado;
            this.beanSeguridad.EMPRESAS =  respuestaWS.empresas;

            //Actualizar la Base informacion del Vendedor
            this.registro = {};
            this.registro.CODUSUARIO = respuestaWS.codusuario;
            this.registro.NOMBRE =  respuestaWS.nombres;
            this.registro.CLAVE = this.data.password;
            this.registro.CLIENTESTODOS = "";
            this.registro.ULTIMAACTUALIZACION = "-------";
            this.registro.CLIENTESTODOS = respuestaWS.empresas;

            this.registrodos.CODUSUARIO =respuestaWS.codusuario;

            this.tasksService.insertarRegistros(this.tasksService.TABLA_COBUSUARIOS, this.registro)
              .then(response => {
                //this.tasks.unshift( data );
                console.log("guardado Exitoso");
                //Envio a la nueva pantalla

                this.tasksService.verificaParamnc()
                  .then(response =>{
                    console.log("VERFPARAM1->"+JSON.stringify(response));
                    console.log("VERFPARAM2->"+response[0].VALOR);
                    //this.tasksdos = response[0].VALOR;

                    //let paramnc = "" + this.tasksdos;
                    let paramnc = response[0].VALOR;
                    console.log("EXISTEPARAMNC--->"+paramnc);
                    if (Number(paramnc) == 0) {
                      this.tasksService.insertarRegistros(this.tasksService.TABLA_NCPARAMETROS,this.registrodos)
                        .then(response =>{
                          console.log("guardado p Exitoso");
                        })
                    }else{
                      console.log("BLOQUEELSE");

                      this.tasksService.obtenerFechaSincroNC(this.beanSeguridad.USUARIO_LOGONEADO)
                        .then(fechasincro => {
                          this.sincronc = fechasincro[0];
                          var fechaultsincronc = "" + this.sincronc.fechaSincro;
                          console.log("validarUsuarioOnLine-->" + fechaultsincronc);
                          this.beanSeguridad.FECHASINCRONIZADONC = fechaultsincronc;
                          ///
                          console.log("FECHAENVIAR-->" + this.beanSeguridad.FECHASINCRONIZADONC);

                          this.tasksService.existenRegistros("FACNOTACREDITOCAB")
                            .then(existe => {
                              this.registronc = existe[0];

                              var cadenaJSON = "" + this.registronc.VALOR;
                              console.log("CANTIDADREGCABNC ==> " + cadenaJSON);
                              if (cadenaJSON.length > 0) {

                                this.beanSeguridad.banPrivez = true;
                                console.log("ASIGNAbanPrivez ==>" + this.beanSeguridad.banPrivez);
                              }

                            })
                        })
                    }


                  });
                let parametros = {usuario:this.data.username};
                this.navCtrl.setRoot(HomePage, parametros);

                /*this.tasksService.insertarRegistros(this.tasksService.TABLA_NCPARAMETROS,this.registrodos)
                  .then(response =>{
                  console.log("guardado p Exitoso");
                  let parametros = {usuario:this.data.username};
                  this.navCtrl.setRoot(HomePage, parametros);
                });*/





              })

              .catch( error => {
                console.error( error );
              })

          }else{

            //loading.dismiss();

            let alert = this.alertCtrl.create({
              title: 'Atención',
              subTitle: ' Error ==> '+respuestaWS.mensaje,
              buttons: ["Aceptar"]
            });
            alert.present();
          }

          //termina proceso
          resolve();

        })
        .catch( error => {

          //loading.dismiss();
          console.log(JSON.stringify(error.json()));

          //Error Comunicacion
          let alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle: ' Error - No existe comunicación con el Servidor ',
            buttons: ["Aceptar"]
          });
          alert.present();

          //termina proceso
          reject(error.json());

        });
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
