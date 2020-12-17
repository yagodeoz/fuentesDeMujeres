import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TasksServiceProvider } from '../tasks-service/tasks-service';
import { AlertController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import 'moment/locale/es';

@Injectable()
export class BeanSeguridad {

    //Constantes
    public isAMBIENTE_PROD:boolean = true;
    private URL_DESA:string = "http://192.168.204.15:8081/MyBusinessWeb/servlet/SWSIntegracionesApp?";
    private URL_PROD:string = "https://www.dmujeres.com.ec:8443/MyBusinessWeb/servlet/SWSIntegracionesApp?";
    public urlServicioReportes = "https://www.dmujeres.com.ec:8443/MyBusinessWeb/servlet/ServicioTransporteReportes";
    public urlUpdateXML = "http://www.dmujeres.com.ec:8082/jasperserver/descargas/updateApp.xml";
    //public urlUpdateXML = "http://192.168.0.220:8080/jasperserver/descargas/updateApp.xml";

    //Valores Default - Se Re-escriben en el Login
    public USUARIO_LOGONEADO:string = "-";
    public NOMBRE_USUARIO:string = "-";
    public SINCRONIZADO:boolean = true;
    public FECHASINCRONIZADO = "01/01/2018 00:01";
    public EN_LINEA:boolean = true;
    public EMPRESAS:any = {};

    constructor(public http: HttpClient, public tasksService: TasksServiceProvider, public alertCtrl:AlertController,public loadingCtrl: LoadingController){}

     /**** PROCESO OBTENCION FECHA ACTUAL *******/
     fechaActual(){
        let fechaHoy = moment().format('YYYY-MM-DD, h:mm:ss a');
        return fechaHoy;
    }

    /******* PROCESO ESTANDARIZADO PARA INVOCACION WS **************/
    obtenerInformacionWS(accion:string, parametros:any){
        var myheader = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
        let httpParams = new HttpParams().append('codusuario', this.USUARIO_LOGONEADO)
                                          .append('cadenaJson', JSON.stringify(parametros));
        var link = (this.isAMBIENTE_PROD)? this.URL_PROD : this.URL_DESA;
        console.log("link ==> "+ link +" accion ==> "+ accion);
        return new Promise((resolve, reject) => {
        this.http.post(link  + "accion="+accion , httpParams, {headers: myheader}) //this.http.get(link + "accion="+accion, {params: parametros})
            .subscribe(res => {
                console.log("data res ==> "+JSON.stringify(res));
                resolve(res);
            }, (err) => {
                console.log("data err ==> "+JSON.stringify(err));
                let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: 'No existe comunicación con el Servidor, por favor intente mas tarde.. ',
                    buttons: ["Aceptar"]
                });
                alert.present();
                reject(err);
            });
        });
    }
    /*************************************************************/



    //Metodo Actualizar informacion
    actualizarApp(){
        //Mensaje de Confirmacion del Pago
        let confirm = this.alertCtrl.create({
        title: 'Atención',
        message: 'Se actualizará la Información a la fecha actual:  ¿Esta seguró que desea actualizar?',
        buttons: [
            {
                text: 'Si', handler: () => { this.sincronizacionInformacionCobranzas(); }
            },
            {
                text: 'No',   handler: () => { console.log('No selected!'); }
            }
        ]
        });
        confirm.present();
    }

    //Sincronizar la Informacion del Usuario
    sincronizacionInformacionCobranzas(){
        console.log("Inicio - sincronizacionInformacionCobranzas");
        //**************************************************************
        let loading = this.loadingCtrl.create({ content: 'Actualizando Información... <br><b>Por favor espere...</b>' });
        loading.present()
        //Cabecera Cartera
        .then(() => loading.setContent('Actualizando Información Cobranzas<b>(1/3)... <br>Por favor espere...</b>' ))
        .then(() => this.tasksService.eliminarTabla(this.tasksService.TABLA_COBCARTERACAB))
        .then(() => this.tasksService.crearTabla(this.tasksService.TABLA_COBCARTERACAB))
        .then(() => this.actualizarCarteraCabecera(0))
        //Detalles Cartera
        .then(() => loading.setContent('Actualizando Información Cobranzas<b>(2/3)... <br>Por favor espere...</b>' ))
        .then(() => this.tasksService.eliminarTabla(this.tasksService.TABLA_COBCARTERADET))
        .then(() => this.tasksService.crearTabla(this.tasksService.TABLA_COBCARTERADET))
        .then(() => this.actualizarCarteraDetalles(0))
        //Actualizar Parametros Generales
        .then(() => loading.setContent('Actualizando Información Cobranzas<b>(3/3)... <br>Por favor espere...</b>' ))
        //.then(() => this.actualizarCobros(0))
        .then(() => this.actualizarParametros())
        //Actualizar Usuario
        .then(() => this.validaSincronizacion())
        //Cierre Espera
        .then(() => loading.dismiss())
        //Refrescar Pantalla
        //.then(() => location.reload());
        //.then(() => this.navCtrl.setRoot(HomePage, null));
        //**************************************************************
        console.log("Fin - sincronizacionInformacionCobranzas");
    }

    /*** ACTUALIZAR CABECERA CARTERA */
    actualizarCarteraCabecera(indice:any){

        //Variables
        let parametroWS:any;
        let respuestaWS:any;
        let sqlGeneral = 'INSERT OR REPLACE INTO [TABLA]([CAMPOS]) VALUES([VALORES]);';
        var sqlInsert:Array<string>= [];

        return new Promise((resolve, reject) => {

            //console.log("OBTENER_CARTERA_CAB ==> " + indice);
            parametroWS = {indice:indice};
            this.obtenerInformacionWS("OBTENER_CARTERA_CAB", parametroWS)
            .then(data => {
            respuestaWS = data;

            if(respuestaWS.exito == "true"){
                //Evaluo si es final de la actualizacion
                console.log("respuestaWS ==> " + respuestaWS.cantidad_registros + " loopExit: " + respuestaWS.final);

                //Inserta los Registros Obtenidos
                if((respuestaWS.cantidad_registros * 1) > 0){
                //Ajuste del query de insercion
                sqlGeneral = sqlGeneral.replace('[TABLA]',this.tasksService.TABLA_COBCARTERACAB)
                sqlGeneral = sqlGeneral.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, NOMBRECLIENTE, EMAILCLIENTE, CODIGOVENDEDOR, "+
                                                "USUARIOVENDEDOR, VENCIDO, XVENCER, AFAVOR, TOTAL");

                //console.log("sqlGeneral ==> " + sqlGeneral);
                for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++)
                {
                    //console.log("insertar ==> " + respuestaWS.data[i].CODEMPRESA+" "+respuestaWS.data[i].CODCLIENTE);
                    sqlInsert.push(sqlGeneral.replace('[VALORES]',"\""+respuestaWS.data[i].CODEMPRESA+"\","+
                                                                "\""+respuestaWS.data[i].CODCLIENTE+"\","+
                                                                "\""+respuestaWS.data[i].NOMBRECLIENTE+"\","+
                                                                "\""+respuestaWS.data[i].EMAILCLIENTE+"\","+
                                                                "\""+respuestaWS.data[i].CODIGOVENDEDOR+"\","+
                                                                "\""+respuestaWS.data[i].USUARIOVENDEDOR+"\","+
                                                                "\""+respuestaWS.data[i].VENCIDO+"\","+
                                                                "\""+respuestaWS.data[i].XVENCER+"\","+
                                                                "\""+respuestaWS.data[i].AFAVOR+"\","+
                                                                "\""+respuestaWS.data[i].TOTAL+"\""));
                }

                //Envio a Insertar en batch los registros obtenidos
                this.tasksService.db.sqlBatch(sqlInsert)
                .then(() => {
                    console.log('Imported TABLA_COBCARTERACAB #'+indice);
                    sqlInsert = [];
                })
                .catch(e => console.error(e));

                //Vuelve a llamar al Proceso - Si aun no termina la interaccion
                if(respuestaWS.final != "true"){
                    this.actualizarCarteraCabecera(indice+1)
                    .then(data => {
                    console.log("Proceso Ejecutado");
                    //Retorno Respuesta
                    resolve(respuestaWS);
                    })
                    .catch( error => { console.log("ERROR ==> " + JSON.stringify(error.json())); });
                }else{
                    //Retorno Respuesta
                    resolve(respuestaWS);
                }
                }else{
                resolve(respuestaWS);
                }

            }else{
                let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error ==> '+respuestaWS.mensaje,
                buttons: ["Aceptar"]
                });
                alert.present();
            }

            //Retorno Respuesta
            //resolve(respuestaWS);
            })
            .catch( error => {
            //console.log("ERROR ==> " + JSON.stringify(error.json()));
            reject(error.json());
            });
        })
    }

    actualizarCobros(indice:any){

        //Variables
        let parametroWS:any;
        let respuestaWS:any;

        return new Promise((resolve, reject) => {

        //Obtengo los cobros a validar
        this.tasksService.obtenerCobrosEstado('ENVIADO')
        .then(data => {
            if(data.length<=0){
            resolve();
            return;
            }

            //Recorro los registros encontrados
            let contador:any = 0;
            let cobrosEnvio: any = [];
            for(let i = 0; i < data.length; i++){
            cobrosEnvio.push({"EMPRESA":data[i].CODEMPRESA, "IDRECIBO":data[i].IDRECIBO});
            contador++;

            //Envio a verificar los cobros
            if(contador>= 15){
                //***********************************
                parametroWS = {detalles:JSON.stringify(cobrosEnvio)};
                this.obtenerInformacionWS("VALIDAR_COBROS", parametroWS)
                .then(data => {
                //Actualiza Cobros recibidos
                respuestaWS = data;
                if(respuestaWS.exito == "true"){
                    for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++)
                    {
                    this.tasksService.cambiarEstadoCobros(respuestaWS.data[i].EMPRESA,  respuestaWS.data[i].IDRECIBO, respuestaWS.data[i].ESTADO, null)
                    .then(data => { console.log("Actualizado: "+respuestaWS.data[i].CODEMPRESA+"/"+ respuestaWS.data[i].IDRECIBO+"/"+respuestaWS.data[i].CODESTADO);});
                    }
                    //resolve();
                }
                else{
                    let alert = this.alertCtrl.create({
                    title: 'Atención',
                    subTitle: ' Error ==> '+respuestaWS.mensaje,
                    buttons: ["Aceptar"]
                    });
                    alert.present();
                }
                }).catch( error => {
                console.log("ERROR ==> " + JSON.stringify(error.json()));
                //reject(error.json());
                });
                //***********************************

                cobrosEnvio = [];
                contador = 0;
            }
            }



        }).catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));
            reject(error.json());
        });
        })
    }

    /*** ACTUALIZAR DETALLES CARTERA */
    actualizarCarteraDetalles(indice:any){

        //Variables
        let parametroWS:any;
        let respuestaWS:any;
        let sqlGeneral = 'INSERT OR REPLACE INTO [TABLA]([CAMPOS]) VALUES([VALORES]);';
        var sqlInsert:Array<string>= [];

        return new Promise((resolve, reject) => {

            //console.log("OBTENER_CARTERA_DET ==> " + indice);
            //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO+"&indice="+indice;
            parametroWS = {indice:indice};
            this.obtenerInformacionWS("OBTENER_CARTERA_DET", parametroWS)
            .then(data => {
            respuestaWS = data;

            if(respuestaWS.exito == "true"){
                //Evaluo si es final de la actualizacion
                //if(respuestaWS.final == "true"){ this.loopExit = true; }
                console.log("respuestaWS ==> " + respuestaWS.cantidad_registros + " loopExit: " + respuestaWS.final);

                //Inserta los Registros Obtenidos
                if((respuestaWS.cantidad_registros * 1) > 0){
                //Ajuste del query de insercion
                sqlGeneral = sqlGeneral.replace('[TABLA]',this.tasksService.TABLA_COBCARTERADET)
                sqlGeneral = sqlGeneral.replace('[CAMPOS]',"CODEMPRESA, CODCLIENTE, REFERENCIA, NUMCUOTA, "+
                                                            "NUMDOCUMENTO, FECHAEMISION, DIASFEMISION, VALORCUOTA, "+
                                                            "VALORCHEQUE, VALORSALDO, ORDENAMIENTO, VALORXAPLICAR, VENDEDOR ");

                for(let i = 0; i < (respuestaWS.cantidad_registros * 1); i++)
                {
                    //console.log("insertar ==> " + respuestaWS.data[i].CODEMPRESA+" "+respuestaWS.data[i].REFERENCIA+" "+respuestaWS.data[i].NUMDOCUMENTO);
                    sqlInsert.push(sqlGeneral.replace('[VALORES]',"\""+respuestaWS.data[i].CODEMPRESA+"\","+
                                                                "\""+respuestaWS.data[i].CODCLIENTE+"\","+
                                                                "\""+respuestaWS.data[i].REFERENCIA+"\","+
                                                                "\""+respuestaWS.data[i].NUMCUOTA+"\","+
                                                                "\""+respuestaWS.data[i].NUMDOCUMENTO+"\","+
                                                                "\""+respuestaWS.data[i].FECHAEMISION+"\","+
                                                                "\""+respuestaWS.data[i].DIASFEMISION+"\","+
                                                                "\""+respuestaWS.data[i].VALORCUOTA+"\","+
                                                                "\""+respuestaWS.data[i].VALORCHEQUE+"\","+
                                                                "\""+respuestaWS.data[i].VALORSALDO+"\","+
                                                                "\""+respuestaWS.data[i].ORDENAMIENTO+"\","+
                                                                "\""+respuestaWS.data[i].VALORXAPLICAR+"\","+
                                                                "\""+(respuestaWS.data[i].VENDEDOR!=null?respuestaWS.data[i].VENDEDOR:"-")+"\""));
                }

                //Envio a Insertar en batch los registros obtenidos
                this.tasksService.db.sqlBatch(sqlInsert)
                .then(() => {
                    console.log('Imported TABLA_COBCARTERADET #'+indice);
                    sqlInsert = [];
                })
                .catch(e => console.error(e));

                //Vuelve a llamar al Proceso
                if(respuestaWS.final != "true"){
                    this.actualizarCarteraDetalles(indice+1)
                    .then(data => {
                    console.log("Proceso Ejecutado");
                    //Retorno Respuesta
                    resolve(respuestaWS);
                    })
                    .catch( error => { console.log("ERROR ==> " + JSON.stringify(error.json())); });
                }else{
                    //Retorno Respuesta
                    resolve(respuestaWS);
                }

                }else{
                //Terminado
                resolve(respuestaWS);
                }

            }else{
                let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error ==> '+respuestaWS.mensaje,
                buttons: ["Aceptar"]
                });
                alert.present();
            }

            //Retorno Respuesta
            //resolve(respuestaWS);

            })
            .catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));
            reject(error.json());
            });
        })
    }


    //*** ACTUALIZAR PARAMETROS *****
    actualizarParametros(){
        //Variables
        let parametroWS:any;
        let respuestaWS:any;

        return new Promise((resolve, reject) => {

            //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO;
            parametroWS = {};
            this.obtenerInformacionWS("PARAMETROS_CXC", parametroWS)
            .then(data => {
            respuestaWS = data;

            if(respuestaWS.exito == "true"){
                //Parametros
                this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"FORMASPAGO", VALOR:JSON.stringify(respuestaWS.formaspago)})
                .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"BANCOS", VALOR:JSON.stringify(respuestaWS.bancos)}))
                .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"TARJETAS", VALOR:JSON.stringify(respuestaWS.tarjetas)}))
                .then(() =>  this.tasksService.insertarRegistros(this.tasksService.TABLA_COBPARAMETROS,{CODPARAMETRO:"CUENTAS", VALOR:JSON.stringify(respuestaWS.cuentas)}))
                .then(() =>  resolve(respuestaWS));
            }else{
                let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error ==> '+respuestaWS.mensaje,
                buttons: ["Aceptar"]
                });
                alert.present();
            }

            })
            .catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));
            reject(error.json());
            });
        })
    }

    /*** ACTUALIZAR Fecha Ultima Sincronizacion */
    validaSincronizacion(){

        //Variables
        let parametroWS:any;
        let respuestaWS:any;

        return new Promise((resolve, reject) => {

            console.log("VALIDASINCRONIZACION ==> ");
            //parametroWS = "&codusuario="+this.beanSeguridad.USUARIO_LOGONEADO;
            parametroWS = {};
            this.obtenerInformacionWS("VALIDASINCRONIZACION", parametroWS)
            .then(data => {
            respuestaWS = data;

            if(respuestaWS.exito == "true"){

                this.tasksService.updateUsuario({CODUSUARIO:this.USUARIO_LOGONEADO, ULTIMAACTUALIZACION:respuestaWS.fecha, EMPRESAS:JSON.stringify(respuestaWS.empresas) })
                .then(data => {
                console.log("Registro actualizado");
                this.FECHASINCRONIZADO = respuestaWS.fecha;
                this.SINCRONIZADO = true;
                this.EMPRESAS = JSON.stringify(respuestaWS.empresas);
                }).catch( error => {  console.log("ERROR ==> " + JSON.stringify(error.json())); });

            }else{
                let alert = this.alertCtrl.create({
                title: 'Atención',
                subTitle: ' Error ==> '+respuestaWS.mensaje,
                buttons: ["Aceptar"]
                });
                alert.present();
            }

            //Retorno Respuesta
            resolve(respuestaWS);

            })
            .catch( error => {
            console.log("ERROR ==> " + JSON.stringify(error.json()));
            reject(error.json());
            });
        })
    }


}
