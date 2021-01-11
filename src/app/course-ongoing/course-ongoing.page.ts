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
  public map: google.maps.Map

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
          console.log("LOCATION")
          console.log(this.lat);
          console.log(this.lon);
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
            this.initMap();
            return position;
          })
          // if error
          .catch(err => {
            // close loader and return Null
            loader.dismiss();
            console.log(err);
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

  initMap() {
    //let places = new google.maps.places.PlacesServices(this.map)
    const POSITION = {
      lat: this.lat,
      lng: this.lon
    }
    console.log(POSITION);
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
}