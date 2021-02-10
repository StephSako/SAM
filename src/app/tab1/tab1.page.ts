import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';

import { AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { AuthService } from '../services/auth.service';
import { DriverData } from './driver-data.model';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Page implements OnInit {

  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;
  public map: google.maps.Map
  private drivers: DriverData[];

  public lat;
  public lon;
  public bounds;


  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  public coordinates: Observable<GeolocationPosition>;
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  constructor(
    public loading: LoadingController,
    public alertCtrl: AlertController,
    private titleService: Title,
    private authService: AuthService
  ) { }

  ngOnInit() {
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
            this.placeDriverMarker();
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
      switchMap((data: any) => of(data.coords))
    );
    return POSITION;
  }

  placeDriverMarker() {
    this.drivers.forEach(driver => {
      if ((driver.longitude_pos) && (driver.latitude_pos)) {
        let msg = "<b>" + driver.firstname + " " + driver.lastname + " à 3km"
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


  }

  onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    const self = this;
    let pt = new google.maps.LatLng(this.latitude, this.longitude);
    new google.maps.Marker({
      position: pt,
      map: this.map
    })
    this.map.setCenter(pt);
    this.map.setZoom(12);
  }
}
