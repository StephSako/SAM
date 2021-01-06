import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SharedModule } from '../shared/shared.module';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    SharedModule,
    MatGoogleMapsAutocompleteModule
  ],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1PageModule {}
