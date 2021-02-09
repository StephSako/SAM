import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-course-ongoing',
  templateUrl: './course-ongoing.page.html',
  styleUrls: ['./course-ongoing.page.scss'],
})
export class CourseOngoingPage implements OnInit {

  distance: number = -1;
  time: number = -1;
  lon;
  lat;
  currLon;
  currLat;
  private directionService;
  public map: google.maps.Map;
  private markers = new Array();

  public coordinates: Observable<GeolocationPosition>;
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(public loading: LoadingController,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation().extras.state) {
          this.lon = this.router.getCurrentNavigation().extras.state.lon;
          this.lat = this.router.getCurrentNavigation().extras.state.lat;
        }
      })
      this.directionService = new google.maps.DirectionsService();
    }

  ngOnInit() {
    /**/
    // start the loader
    this.displayLoader()
      .then((loader: any) => {
        // get position
        return this.getCurrentLocation()
          .then(position => {
            //close loader and return position
           this.currLat = position.coords.latitude;
           this.currLon = position.coords.longitude;
            loader.dismiss();
            this.initMap();
            this.trajet();
            
            return position;
          })
          // if error
          .catch(err => {
            // close loader and return Null
            loader.dismiss();
            return null;
          });
      });
    /**
    this.getCurrentLocation();
    /**/
    //GET DISTANCE AND TIME
    this.distance = 280;
    this.time = 3;
  }

  async displayLoader() {
    const loading = await this.loading.create({
      message: 'Loading...'
    });
    await loading.present();
    return loading;
  }

  private async presentAlert(message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      header: "Alert!",
      subHeader: "Application offline",
      message: message,
      buttons: ["OK"]
    })
    await alert.present();
    return alert;
  }

  private async getCurrentLocation(): Promise<any> {
    const isAvailable: boolean = Capacitor.isPluginAvailable("Geolocation");
    if (!isAvailable) {
      return of(new Error("ERR: Plugin not available"));
    }
    const POSITION = Plugins.Geolocation.getCurrentPosition()
      // handle Capacitor errors
      .catch(err => {
        return new Error(err.message || "customized message");
      });
    this.coordinates = fromPromise(POSITION).pipe(
      switchMap((data: any) => of(data.coords)),
      tap(data => console.log(data))
    );
    return POSITION;
  }

  initMap() {
    //let places = new google.maps.places.PlacesServices(this.map)
    const POSITION = {
      lat: this.lat,
      lng: this.lon
    }
    this.map = new google.maps.Map(
      document.getElementById("map2"),
      {
        zoom: 12,
        center: POSITION,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );
    const footer = document.getElementById("footer");
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(footer);
  }

   trajet() {
    this.clearMarkers();
    let start = new google.maps.Marker({
      position: {
        lat: this.currLat,
        lng: this.currLon
      }
    });

    let end = new google.maps.Marker({
      position: {
        lat: this.lat,
        lng: this.lon
      }
    });
    this.markers.push(start);
    this.markers.push(end);
    
    new google.maps.DistanceMatrixService().getDistanceMatrix({
      origins: [start.getPosition()],
      destinations: [end.getPosition()],
      travelMode: google.maps.TravelMode.DRIVING
    }, this.callbackDistance);

    const request = {
        origin: start.getPosition(),
        destination: end.getPosition(),
        travelMode: 'DRIVING'
      }
    
    let directionsRenderer = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: false,
      map: this.map
    });
    directionsRenderer.setMap(this.map);

    this.directionService.route(request, function(result, status) {
      
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
        //this.map.fitBounds(directionsRenderer.getDirections().routes[0].bounds);
      }
    });
  }

  callbackDistance(response, status) {
    if (status == 'OK') {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
  
      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];
        }
      }
    }
  }

  addMarker(marker: google.maps.Marker) {
    marker.setMap(this.map);
    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = new Array();
  }
}