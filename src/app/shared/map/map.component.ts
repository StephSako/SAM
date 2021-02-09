import { AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MapComponent implements AfterViewInit {

  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;
  public map: any



  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef

  @Input() coords: {
    latitude: number,
    longitude: number
  }

  public static lat;
  public static lon;
  public static bounds;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Home | @angular-material-extensions/google-maps-autocomplete');

    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;

    this.setCurrentPosition();

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    MapComponent.bounds  = new google.maps.LatLngBounds();
    var input = document.getElementById('pac-input') as HTMLInputElement;
    //let places = new google.maps.places.PlacesServices(this.map)
    const POSITION = {
      lat: this.coords.latitude,
      lng: this.coords.longitude
    }
    this.map = new google.maps.Map(
      document.getElementById("map"),
      {
        zoom: 12,
        center: POSITION || {lat: 22, lng: 22},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );

  }
}
