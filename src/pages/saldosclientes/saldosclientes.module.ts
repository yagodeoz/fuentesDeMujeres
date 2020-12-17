import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaldosclientesPage } from './saldosclientes';

@NgModule({
  declarations: [
    SaldosclientesPage,
  ],
  imports: [
    IonicPageModule.forChild(SaldosclientesPage),
  ],
})
export class SaldosclientesPageModule {}
