import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const POSITION = {
      lat: this.coords.latitude,
      lng: this.coords.longitude
    }
    
    const map = new google.maps.Map(
      document.getElementById("map"),
      {
        zoom: 12,
        center: POSITION || {lat: 22, lng: 22}
      }
    );

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const marker = new google.maps.Marker({
      position: POSITION,
      map: map
    });
    const tmpMarker = new google.maps.Marker({
      position: {
        lat: 48.732219,
        lng: 2.373088
      },
      map: map
    });

    const request = {
      origin: marker.getPosition(),
      destination: tmpMarker.getPosition(),
      travelMode: 'DRIVING'
    }

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }


}
