import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverMapPageRoutingModule } from './driver-map-routing.module';

import { DriverMapPage } from './driver-map.page';
import { SharedModule } from '../shared/shared.module';

import { ModalController } from '@ionic/angular';
import { ChatPageModule } from '../chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverMapPageRoutingModule,
    SharedModule,
    ChatPageModule
  ],
  declarations: [DriverMapPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DriverMapPageModule {}