import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { DriverData } from '../tab1/driver-data.model';

@Component({
  selector: 'app-search-place',
  templateUrl: './search-place.page.html',
  styleUrls: ['./search-place.page.scss'],
})
export class SearchPlacePage implements OnInit {

  private latitude;
  private longitude;
  public lat;
  public lon;
  public bounds;
  public map: google.maps.Map;
  private driver: DriverData;
  private clientAdress : string;
  private originLat;
  private originLon;

  public coordinates: Observable<GeolocationPosition>;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(private router:Router, 
    public loading: LoadingController, 
    public alertCtrl: AlertController,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation().extras.state) {
          this.driver = this.router.getCurrentNavigation().extras.state.driver;
          this.clientAdress = this.router.getCurrentNavigation().extras.state.clientAddress;
          this.originLat = this.router.getCurrentNavigation().extras.state.originLat;
          this.originLon = this.router.getCurrentNavigation().extras.state.originLon;
        }
      })
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
            loader.dismiss();
            console.log(position);
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            this.initMap();
            return position;
          })
          // if error
          .catch(err => {
            // close loader and return Null
            loader.dismiss();
            return null;
          });
      });
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

  initMap() {
    const POSITION = {
      lat: this.lat,
      lng: this.lon
    }
    this.map = new google.maps.Map(
      document.getElementById("mapsearch"),
      {
        zoom: 12,
        center: POSITION || { lat: 22, lng: 22 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );
    const autocomplete = document.getElementById("autocomplete");
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(autocomplete);
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    this.latitude = result.geometry.location.lat();
    this.longitude = result.geometry.location.lng();
    console.log(this.latitude);
    console.log(this.longitude);

    let naviguationExtras: NavigationExtras = {
      state: {
        lat: this.latitude, 
        lon: this.longitude, 
        driver: this.driver, 
        address: result.formatted_address,
        clientAddress: this.clientAdress,
        originLat: this.originLat,
        originLon: this.originLon
      }
    }
    this.router.navigate(['/course-ongoing'], naviguationExtras);
  }

  onLocationSelected(location: Location) {
    //console.log('onLocationSelected: ', location);


  }
}
