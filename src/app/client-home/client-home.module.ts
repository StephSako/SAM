import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientHomePageRoutingModule } from './client-home-routing.module';

import { ClientHomePage } from './client-home.page';

import { SharedModule } from '../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientHomePageRoutingModule,
    SharedModule
  ],
  declarations: [ClientHomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientHomePageModule {}
