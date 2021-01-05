import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Geolocation} from '@google/maps'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {AgmCoreModule} from '@agm/core';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAVGj5itu-LpZF5Y0F2qpSpXvyhW2Oq_g0',
      libraries: ['places']
    }),
    MatGoogleMapsAutocompleteModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
