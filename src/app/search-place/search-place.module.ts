import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPlacePageRoutingModule } from './search-place-routing.module';

import { SearchPlacePage } from './search-place.page';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { MatFormField } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPlacePageRoutingModule,
    MatGoogleMapsAutocompleteModule,
    IonicModule,
    CommonModule,
    FormsModule,
    MatGoogleMapsAutocompleteModule
  ],
  declarations: [SearchPlacePage]
})
export class SearchPlacePageModule {}
