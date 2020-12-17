import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import {PrintProvider} from '../../providers/print/print';

/**
 * Generated class for the ImprimirPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imprimir',
  templateUrl: 'imprimir.html',
})
export class ImprimirPage {

  imprimirTexto:string = null;
  imprimirHTML:string = null;
  habilitaImprimir:boolean = false;

  constructor(private view: ViewController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private printProvider:PrintProvider) {
 

        this.imprimirTexto =  this.navParams.get('texto');
        this.imprimirHTML = this.imprimirTexto;
        this.habilitaImprimir = ("S" == this.navParams.get('imprimir'));

        //var re = /\n/gi;
        //this.imprimirHTML =  this.imprimirTexto.replace(re,"<br>");
  }

  enviarImprimir(){
    let confirm = this.alertCtrl.create({
      title: 'Atención',
      message: '¿Esta seguró que desea Imprimir el Documento?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.printProvider.enviarImpresionTicket(""+this.imprimirTexto);
          }
        },
        { text: 'No',  handler: () => { console.log('No selected!'); } }
      ]
    });
    confirm.present();
  }

  closeModal() {    
      this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImprimirPage');
  }

}
