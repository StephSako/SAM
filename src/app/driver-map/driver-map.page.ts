import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../interfaces/userInterface';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.page.html',
  styleUrls: ['./driver-map.page.scss'],
})
export class DriverMapPage implements OnInit {

  distance: number = -1;
  time: number = -1;

  public coordinates: Observable<GeolocationPosition>;
  public lat;
  public lon;
  public bounds;
  public map: google.maps.Map;
  private driver: UserInterface;
  isOnline: boolean;
  isLoading : boolean;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  constructor(public loading: LoadingController,
    public alertCtrl: AlertController,
    private socket: Socket,
    private authService: AuthService) {
      this.driver = this.authService.getUserDetails();
      this.isOnline = false;
      this.isLoading = true;
      socket.emit("isConnected", this.driver);

      //Listen on server response for driver connection status
      socket.fromEvent('driverConnected').subscribe(data => {
        this.isLoading = false;
        this.isOnline = true;
      });

      socket.fromEvent('driverDisconnected').subscribe(data => {
        this.isLoading = false;
        this.isOnline = false;
      });

      socket.fromEvent('driverCourse').subscribe(data => {
        console.log(data)
        this.launchAlert(data);

      });
    }

  ngOnInit() {
    /**/
    // start the loader
    console.log(this.driver)
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
    /**
    this.getCurrentLocation();
    /**/
    //GET DISTANCE AND TIME
    this.distance = 280;
    this.time = 3;
  }

  async launchAlert(data) {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle course',
      message: 'Nouvelle course trouvé pour <b>' + data.client.firstname + ' ' + data.client.lastname + '</b><br/> <b>Emplacement :</b> ' + data.clientAddress + '<br/>' + '<b>Destination : </b>' + data.address
    })

    await alert.present();
  }

  //Tell the server new driver is connected
  connectDriver() {
    this.socket.emit('driverJoin', this.driver);
    this.isLoading = true;
  }

  //Tell the server driver disconnect
  disconnectDriver() {
    this.socket.emit('driverLeave', this.driver);
    this.isOnline = false;
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
    const POSITION = {
      lat: this.lat,
      lng: this.lon
    }
    this.map = new google.maps.Map(
      document.getElementById("mapdriver"),
      {
        zoom: 12,
        center: POSITION || { lat: 22, lng: 22 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );
    const footer = document.getElementById("footerdriver");
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(footer);
  }

}