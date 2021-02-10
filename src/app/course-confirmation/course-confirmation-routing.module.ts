import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseConfirmationPage } from './course-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: CourseConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseConfirmationPageRoutingModule {}
