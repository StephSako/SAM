import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseConfirmationPageRoutingModule } from './course-confirmation-routing.module';

import { CourseConfirmationPage } from './course-confirmation.page';
import { SharedModule } from '../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseConfirmationPageRoutingModule,
    SharedModule
  ],
  declarations: [CourseConfirmationPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CourseConfirmationPageModule {}
