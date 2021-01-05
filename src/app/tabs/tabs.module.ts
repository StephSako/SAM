import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    MatGoogleMapsAutocompleteModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
