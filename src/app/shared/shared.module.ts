import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';

const COMPONENTS: any[] = [
  MapComponent 
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    MatGoogleMapsAutocompleteModule
  ],
  exports: [...COMPONENTS]
})
export class SharedModule { }
