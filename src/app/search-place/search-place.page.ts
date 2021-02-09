import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { NavigationExtras, Router } from '@angular/router';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { LoadingController, AlertController } from '@ionic/angular';

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

  public coordinates: Observable<GeolocationPosition>;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(private router:Router, public loading: LoadingController, public alertCtrl: AlertController) { }

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
      return of (new Error("ERR: Plugin not available"));
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

  onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    let naviguationExtras: NavigationExtras = {state: {lat: this.latitude, lon: this.longitude}}
    this.router.navigate(['/course-ongoing'], naviguationExtras);
  }
}
