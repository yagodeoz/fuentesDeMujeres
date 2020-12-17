import { Injectable } from '@angular/core';
import {AlertController, LoadingController} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/*
  Generated class for the PrintProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrintProvider {

  selectedPrinter:any=[];

  constructor(private btSerial:BluetoothSerial,private alertCtrl:AlertController, private loadingCtrl: LoadingController) {
    
  }

  searchBt()
  {
    return this.btSerial.list();
  }

  connectBT(address)
  {
    return this.btSerial.connect(address);

  }


  //*** ENVIO DE IMPRESION DE TICKET - IMPRESORA BLUETOOTH ****
  enviarImpresionTicket(texto:string){
    console.log("Inicio - enviarImpresionTicket");
    //**************************************************************
    let loading = this.loadingCtrl.create({ content: 'Imprimiendo... <br><b>Por favor espere...</b>' });
    loading.present();
    //Bloques de Impresion
    this.connectPrinter()
    .then(() => this.enviarImpresoraBT(this.selectedPrinter.id, texto))
    //Cierre Espera
    .then(() => loading.dismiss());
    //**************************************************************
    console.log("Fin - enviarImpresionTicket");
  }
  //************************************************************


  //***** SELECCION DE LA IMPRESORA *****************
  connectPrinter()
  { 
    return new Promise((resolve, reject) => {
      //Si no ha sido seleccionada la impresora aun
      var id=this.selectedPrinter.id;
      if(id==null||id==""||id==undefined)
      {
        //Busqueda de la impresora / Conexion
        this.searchBt().then(datalist=>{
          for (let i = 0; i < datalist.length; i++) { 
            if(datalist[i].name.indexOf("Printer") !== -1){     //"IMPBT-DMSA";
              this.selectedPrinter = datalist[i]; 
            }
          }
          //Retorno Respuesta
          resolve(this.selectedPrinter);          

        },err=>{
          console.log("ERROR",err);
          reject(err.json());
        })
      }else{
         //Retorno Respuesta
         resolve(this.selectedPrinter); 
      }
    })
  }

  ///************************************************


  //*** ENVIO DE IMPRESION DE TICKET - IMPRESORA BLUETOOTH ****
  enviarImpresoraBT(address, texto:string)
  {
    if(address==null||address==""||address==undefined)
    {
      let mno=this.alertCtrl.create({
        title:"ERROR => No existe comunicación con la Impresora.",
        buttons:['Cerrar']
      });
      mno.present();
    }else{
      let printData= texto; //"Test hello this is a test \n\n\n\n Hello Test 123 123 123\n\n\n"    
      let xyz=this.connectBT(address).subscribe(data=>{
      this.btSerial.write(printData).then(dataz=>{
        console.log("WRITE SUCCESS",dataz);
        let mno=this.alertCtrl.create({
          title:"Impresinó OK!",
          buttons:['Cerrar']
        });
        mno.present();
        xyz.unsubscribe();
      },errx=>{
        console.log("WRITE FAILED",errx);
        let mno=this.alertCtrl.create({
          title:"ERROR "+errx,
          buttons:['Cerrar']
        });
        mno.present();
      });
      },err=>{
        console.log("CONNECTION ERROR",err);
        let mno=this.alertCtrl.create({
          title:"ERROR "+err,
          buttons:['Cerrar']
        });
        mno.present();
      });
    }
  }
  //********************************************************

}
