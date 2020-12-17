import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PrincipalcobranzaPage } from '../pages/principalcobranza/principalcobranza';
import { NuevacobranzaPage } from '../pages/nuevacobranza/nuevacobranza';
import { SaldosclientesPage } from '../pages/saldosclientes/saldosclientes';
import { CobroclientePage } from '../pages/cobrocliente/cobrocliente';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { HttpModule} from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';
import { BeanSeguridad } from '../providers/seguridad/seguridadApp';

import { PrintProvider } from '../providers/print/print';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { HttpClientModule } from '@angular/common/http';
import { RepcomisionesPage } from '../pages/repcomisiones/repcomisiones';
import { AppUpdate } from '@ionic-native/app-update';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PrincipalcobranzaPage,
    NuevacobranzaPage,
    SaldosclientesPage,
    CobroclientePage,
    RepcomisionesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),    //{tabsPlacement: 'top'}
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PrincipalcobranzaPage,
    NuevacobranzaPage,
    SaldosclientesPage,
    CobroclientePage,
    RepcomisionesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    TasksServiceProvider,
    BeanSeguridad,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BluetoothSerial,
    PrintProvider,
    AppUpdate
  ]
})
export class AppModule {}


