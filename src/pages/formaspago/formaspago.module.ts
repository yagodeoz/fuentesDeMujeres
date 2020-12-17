import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormaspagoPage } from './formaspago';

@NgModule({
  declarations: [
    FormaspagoPage,
  ],
  imports: [
    IonicPageModule.forChild(FormaspagoPage),
  ],
  exports: [
    FormaspagoPage
  ]
})
export class FormaspagoPageModule {}

