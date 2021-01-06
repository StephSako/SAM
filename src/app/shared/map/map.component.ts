import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { any } from 'sequelize/types/lib/operators';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

export class MapComponent implements AfterViewInit {

  @Input() coords: {
    latitude: number,
    longitude: number
  }

  @Input() map: any;
  @Input() directionsService: any;
  private markers = new Array();

  constructor() { }

  ngAfterViewInit() {
    this.initMap();

    var marker1 = new google.maps.Marker({
      position: {
        lat: 48.732219,
        lng: 2.373088
      }
    });

    var marker2 = new google.maps.Marker({
      position: {
        lat: 49,
        lng: 2
      }
    });
    this.trajet(marker1, marker2);
  }

  initMap() {
    const POSITION = {
      lat: this.coords.latitude,
      lng: this.coords.longitude
    }
    
    this.map = new google.maps.Map(
      document.getElementById("map"),
      {
        zoom: 12,
        center: POSITION || {lat: 22, lng: 22}
      }
    );

    this.directionsService = new google.maps.DirectionsService();

    this.markers.push(new google.maps.Marker({
      position: POSITION,
      map: this.map
    }));

  }

  async trajet(start: google.maps.Marker, end: google.maps.Marker) {

    this.clearMarkers();

    const request = {
        origin: start.getPosition(),
        destination: end.getPosition(),
        travelMode: 'DRIVING'
      }
    
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(this.map);

    this.directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = new Array();
  }

  addMarker(marker: google.maps.Marker) {
    marker.setMap(this.map);
    this.markers.push(marker);
  }

}
