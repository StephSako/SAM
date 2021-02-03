import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserInterface } from '../interfaces/userInterface';
import { AuthService } from '../services/auth.service';
import { Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import { DriverData } from '../tab1/driver-data.model';
import PlaceResult = google.maps.places.PlaceResult;
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';
import { Socket } from 'ngx-socket-io';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.page.html',
  styleUrls: ['./client-home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientHomePage implements OnInit {

  public coordinates: Observable<GeolocationPosition>;
  user: UserInterface;
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;
  public map: google.maps.Map;
  private count = 0;
  clientAddress: string;
  private drivers: any;
  private driversMap: DriverData
  private markers : any[];

  public lat;
  public lon;
  public bounds;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(public loading: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private socket: Socket) {
      this.markers = [];
      socket.fromEvent('driversMap').subscribe(data => {
        this.drivers = data;
        console.log(data);
      });

      socket.fromEvent('driversUpdate').subscribe(data => {
        this.markers.forEach((marker) => {
          marker.setMap(null);
        })
        this.markers.length = 0;
        this.drivers = data;
        this.computeClientDistance().then(() => {
          this.placeDriverMarker();
        })
      })
  }

  ngOnInit() {
    this.user = this.authService.getUserDetails();
    this.socket.emit("clientJoin", this.user);
    this.authService
      .getDrivers()
      .subscribe((drivers: DriverData[]) => {
        //this.drivers = drivers;
      })
    /**/
    // start the loader
    this.lat = 45;
    this.lon = 9
    this.displayLoader()
      .then((loader: any) => {
        // get position
        return this.getCurrentLocation()
          .then(position => {
            //close loader and return position
            loader.dismiss();
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            console.log(position);
            this.initMap();
            this.computeClientDistance().then(() => {
              this.placeDriverMarker();
            })

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
  }

  ngAfterViewInit() {
    //
  }

  goback() {
    console.log("retour à la page précédente");
  }

  async redirect() {
    if(Object.keys(this.drivers).length > 0) {
      let lowest = Number.POSITIVE_INFINITY;
      let tmpDriver;
      for(let key in this.drivers) {
        let driver = this.drivers[key];
        let tmpTime = driver.distance_client_time;
  
        if (driver.distance_client_time < lowest) {
          lowest = tmpTime;
          tmpDriver = driver;
        }
      }
      let naviguationExtras: NavigationExtras = { state: { driver: tmpDriver, clientAddress: this.clientAddress, originLat: this.lat, originLon: this.lon} }
      this.router.navigate(['/search-place'], naviguationExtras);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Coursier',
        message: "Il n'y a pas de SAM disponible pour le moment",
        buttons: ['OK']
      });
  
      await alert.present();
    }

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
      console.log("ERR: Plugin is not available");
      return of(new Error("ERR: Plugin not available"));
    }
    const POSITION = Plugins.Geolocation.getCurrentPosition()
      // handle Capacitor errors
      .catch(err => {
        console.log("ERR", err);
        return new Error(err.message || "customized message");
      });
    this.coordinates = fromPromise(POSITION).pipe(
      switchMap((data: any) => of(data.coords)),
      tap(data => console.log(data))
    );
    return POSITION;
  }

  computeClientDistance() {
    return new Promise((resolve, reject) => {
      console.log("LENGTH");
      console.log(Object.keys(this.drivers).length);
      for(let key in this.drivers) {
        let driver = this.drivers[key];
        let start = new google.maps.LatLng(driver.latitude_pos, driver.longitude_pos)
        let end = new google.maps.LatLng(this.lat, this.lon)
        if ((driver.latitude_pos) && (driver.longitude_pos)) {
          new google.maps.DistanceMatrixService().getDistanceMatrix({
            origins: [start],
            destinations: [end],
            travelMode: google.maps.TravelMode.BICYCLING
          }, (response, status) => {
            if (status == 'OK') {
              console.log(response);
              this.count++;
              var origins = response.originAddresses;
              var destinations = response.destinationAddresses;
              this.clientAddress = response.destinationAddresses[0]
              for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                  var element = results[j];

                  var distance = element.distance.text;
                  driver.distance_client_km = distance;

                  var duration = element.duration.value;
                  driver.distance_client_time = +duration;

                  driver.client_time_text = element.duration.text;

                  var from = origins[i];
                  var to = destinations[j];
                }
              }
              if (this.count == Object.keys(this.drivers).length) {
                this.count = 0;
                console.log("FINISHED");
                resolve("ok");
              }
            }
          });
        }
      }
    });

  }

  placeDriverMarker() {
    console.log("PLACE")
    for(let key in this.drivers) {
      let driver = this.drivers[key];
      if ((driver.longitude_pos) && (driver.latitude_pos)) {
        let msg = "<b>" + driver.firstname + " " + driver.lastname + " à " + driver.client_time_text +  " ( "  + driver.distance_client_km + " )<br/>"
        let info = new google.maps.InfoWindow({
          content: msg
        })
        let marker = new google.maps.Marker({
          position: { lat: driver.latitude_pos, lng: driver.longitude_pos },
          map: this.map,
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
        })
        this.markers.push(marker);
        marker.addListener("click", () => {
          info.open(this.map, marker);
        })
      }
    }
  }

  initMap() {
    var input = document.getElementById('pac-input') as HTMLInputElement;
    //let places = new google.maps.places.PlacesServices(this.map)
    const POSITION = {
      lat: this.lat,
      lng: this.lon
    }
    this.map = new google.maps.Map(
      document.getElementById("map"),
      {
        zoom: 12,
        center: POSITION || { lat: 22, lng: 22 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );

    const callButton = document.getElementById("call");
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(callButton);
  }
}
