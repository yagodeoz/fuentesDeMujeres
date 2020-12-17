import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CobroclientePage } from './cobrocliente';

@NgModule({
  declarations: [
    CobroclientePage,
  ],
  imports: [
    IonicPageModule.forChild(CobroclientePage),
  ],
})
export class CobroclientePageModule {}
