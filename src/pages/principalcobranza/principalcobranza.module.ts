import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrincipalcobranzaPage } from './principalcobranza';
//import { listLazyRoutes } from '/lista.js';


@NgModule({
  declarations: [
    PrincipalcobranzaPage
  ],
  imports: [
    IonicPageModule.forChild(PrincipalcobranzaPage),
  ],
})
export class PrincipalcobranzaPageModule {

  //private _myDate: String = new Date().toISOString();

}
