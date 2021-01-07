import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseOngoingPage } from './course-ongoing.page';

const routes: Routes = [
  {
    path: '',
    component: CourseOngoingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseOngoingPageRoutingModule {}