import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientMapPageRoutingModule } from './client-map-routing.module';

import { ClientMapPage } from './client-map.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientMapPageRoutingModule,
    SharedModule
  ],
  declarations: [ClientMapPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientMapPageModule {}