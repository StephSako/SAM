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
import { Router } from '@angular/router';

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
  public map: google.maps.Map
  private drivers: DriverData[];
  private count = 0;

  public lat;
  public lon;
  public bounds;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(public loading: LoadingController, public alertCtrl: AlertController, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUserDetails();
    this.authService
    .getDrivers()
    .subscribe((drivers: DriverData[]) => {
      this.drivers = drivers;
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

  redirect() {
    this.router.navigate(['/search-place']);
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
      return of (new Error("ERR: Plugin not available"));
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
      this.drivers.forEach(driver => {
        let start = new google.maps.LatLng(driver.latitude_pos, driver.longitude_pos)
        let end = new google.maps.LatLng(this.lat, this.lon)
        if((driver.latitude_pos) && (driver.longitude_pos))  {
          new google.maps.DistanceMatrixService().getDistanceMatrix({
            origins: [start],
            destinations: [end],
            travelMode: google.maps.TravelMode.DRIVING
          },(response, status) => {
            if(status == 'OK') {
              this.count++;
              console.log(this.count);
              var origins = response.originAddresses;
              var destinations = response.destinationAddresses;
              console.log(response);
              for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                  var element = results[j];
                  //console.log(element);
                  var distance = element.distance.text;
                  driver.distance_client_km = distance;
                  //console.log(distance);
                  
                  var duration = element.duration.value;
                  driver.distance_client_time = +duration;
                  console.log(duration);
                  
                  var from = origins[i];
                  //console.log(from);
                  var to = destinations[j];
                  //console.log(to);
                }
              }
              if(this.count == 3) {
                this.count = 0;
                resolve("ok");
              }
            }
          });
        }
      })
    });

  }

  placeDriverMarker() {
    console.log("drivers place");
    console.log(this.drivers);
    this.drivers.forEach(driver => {
      //console.log(driver);
      if ((driver.longitude_pos) && (driver.latitude_pos)) {
        console.log(driver.latitude_pos);
        let msg = "<b>" + driver.firstname + " " + driver.lastname + " à " + driver.distance_client_km + " <br/>"
        let info = new google.maps.InfoWindow({
          content: msg
        })
        let marker = new google.maps.Marker({
          position: { lat: driver.latitude_pos, lng: driver.longitude_pos },
          map: this.map,
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
        })
        marker.addListener("click", () => {
          info.open(this.map, marker);
        })
      }
    })
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
