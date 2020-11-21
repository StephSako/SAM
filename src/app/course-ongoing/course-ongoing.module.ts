import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseOngoingPageRoutingModule } from './course-ongoing-routing.module';

import { CourseOngoingPage } from './course-ongoing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseOngoingPageRoutingModule
  ],
  declarations: [CourseOngoingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CourseOngoingPageModule {}
