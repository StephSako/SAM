import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseOngoingPageRoutingModule } from './course-ongoing-routing.module';

import { CourseOngoingPage } from './course-ongoing.page';
import { SharedModule } from '../shared/shared.module';
import { ChatPage } from '../chat/chat.page';
import { ChatPageModule } from '../chat/chat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseOngoingPageRoutingModule,
    SharedModule,
    ChatPageModule
  ],
  declarations: [CourseOngoingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CourseOngoingPageModule {}