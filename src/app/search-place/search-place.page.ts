import { Component, OnInit } from '@angular/core';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-place',
  templateUrl: './search-place.page.html',
  styleUrls: ['./search-place.page.scss'],
})
export class SearchPlacePage implements OnInit {

  private latitude;
  private longitude;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    let naviguationExtras: NavigationExtras = {state: {lat: this.latitude, lon: this.longitude}}
    this.router.navigate(['/course-ongoing'], naviguationExtras);
  }
}
