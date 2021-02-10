import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic5-star-rating';

import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    StarRatingModule],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
