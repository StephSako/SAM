import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientMapPage } from './client-map.page';

const routes: Routes = [
  {
    path: '',
    component: ClientMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientMapPageRoutingModule {}