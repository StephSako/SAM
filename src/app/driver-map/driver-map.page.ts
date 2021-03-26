import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../services/auth.service';
import { UserInterface } from '../interfaces/UserInterface';
import { LatLng } from '@ionic-native/google-maps';
import { ChatPage } from '../chat/chat.page';

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
  public realCourseStart;
  public driverArrived;
  public lat;
  public lon;
  public bounds;
  public map: google.maps.Map;
  public start;
  public dest;
  private driver: UserInterface;
  isOnline: boolean;
  isLoading: boolean;
  private destinationAddress: string;
  private clientAddress: string;
  private iconBase: string;
  private directionService;
  private driverMarker: google.maps.Marker;
  private client: UserInterface;
  private currLat;
  private currLon;
  private stepPoints;
  private clientLat;
  private clientLon;
  private geocoder;
  public courseStarted: boolean;
  public instructions: string;
  public currDistance;
  public currDuration;
  private currInstruction;
  private currStepLat;
  private currStepLng;
  private originLat;
  private originLon;
  private directionsRenderer;
  private startMarker;
  private endMarker;
  public messages = [];


  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  constructor(public loading: LoadingController,
    public alertCtrl: AlertController,
    private socket: Socket,
    private authService: AuthService,
    public modalCtrl: ModalController) {
      this.realCourseStart = false;
      this.driverArrived = false;
      this.start = "Votre position"
      this.instructions = "";
      this.courseStarted = false;
    this.geocoder = new google.maps.Geocoder();

    this.stepPoints = {};
    this.driver = this.authService.getUserDetails();

    this.isOnline = false;
    this.isLoading = true;
    this.iconBase = "http://192.168.1.17/"
    socket.emit("isConnected", this.driver);
    this.directionService = new google.maps.DirectionsService();

    //Listen on server response for driver connection status
    socket.fromEvent('driverConnected').subscribe(data => {
      this.isLoading = false;
      this.isOnline = true;
    });

    socket.fromEvent('driverDisconnected').subscribe(data => {
      this.isLoading = false;
      this.isOnline = false;
    });

    socket.fromEvent('driverCourse').subscribe((data: any) => {
      this.clientAddress = data.clientAddress;
      this.dest = this.clientAddress;
      this.destinationAddress = data.address;
      this.client = data.client;
      this.originLon = data.originLon;
      this.originLat = data.originLat;
      this.launchAlert(data);

    });

    socket.fromEvent('step').subscribe((step: any) => {
      this.instructions = step.instructions;
      this.currDuration = step.duration;
      this.currDistance = step.distance;
      let newLatLng = new google.maps.LatLng(step.latitude, step.longitude);
      this.driverMarker.setPosition(newLatLng);
    })

    socket.fromEvent('courseFinished').subscribe((data:any) => {
      
    })



    socket.fromEvent('driverArrived').subscribe((data: any) => {
      this.start = this.clientAddress;
      this.dest = this.destinationAddress;
      this.driverArrived = true;

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
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            this.initMap();
            this.driverMarker = new google.maps.Marker({
              position: {
                lat: this.driver.latitude_pos,
                lng: this.driver.longitude_pos
              },
              icon: this.iconBase + "bicycle.png",
              map: this.map
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
    this.distance = 280;
    this.time = 3;
  }

  async launchAlert(data) {

    const alert = await this.alertCtrl.create({
      header: 'Nouvelle course',
      message: 'Nouvelle course trouvé pour <b>' +
        data.client.firstname +
        ' ' +
        data.client.lastname +
        '</b><br/> <b>Emplacement :</b> ' +
        data.clientAddress + ' (' + data.driver.client_time_text + ' ) <br/>',
      buttons: [{
        text: 'Accepter', handler: () => {
          this.geocoder.geocode({'address': this.clientAddress}, (results, status) => {
            if(status == 'OK') {
              this.courseStarted = true;
              this.startMarker = new google.maps.Marker({

                position: {
                  lat: this.driver.latitude_pos,
                  lng: this.driver.longitude_pos
                },
                icon: this.iconBase + "green-flag.png",
                map: this.map
              });
    
              this.endMarker = new google.maps.Marker({
    
                position: {
                  lat: this.originLat,
                  lng: this.originLon
                },
                icon: this.iconBase + "red-flag.png",
                map: this.map
              });
    
              this.directionsRenderer = new google.maps.DirectionsRenderer({
                preserveViewport: true,
                suppressMarkers: true,
                map: this.map
              });
              this.directionsRenderer.setMap(this.map);
    
              new google.maps.DistanceMatrixService().getDistanceMatrix({
                origins: [this.startMarker.getPosition()],
                destinations: [this.endMarker.getPosition()],
                travelMode: google.maps.TravelMode.BICYCLING,
                avoidHighways: true,
                avoidTolls: true
              }, this.callbackDistance);

              const request = {
                origin: this.startMarker.getPosition(),
                destination: this.endMarker.getPosition(),
                avoidHighways: true,
                avoidTolls: true,
                travelMode: 'BICYCLING'
              }
    
              this.directionService.route(request, (result, status) => {
                if (status == 'OK') {
                  
                  this.directionsRenderer.setDirections(result);
                  let steps = result.routes[0].legs[0].steps;
                  let i = 0;
                  steps.forEach(step => {
                    this.currDistance = step.distance.text;
                    this.currDuration = step.duration.text;
                    this.currInstruction = step.instructions;
                    step.path.forEach((pos, index) => {
                      i++;
                      var obj = {
                        distance: this.currDistance,
                        duration: this.currDuration,
                        instructions: this.currInstruction,
                        latitude: pos.lat(),
                        longitude: pos.lng(),
                        endRoute: false
                      };
                      this.stepPoints[i] = obj;
                    });
                  });
                  this.socket.emit("sendRoute", this.stepPoints, this.driver, this.client);
                }
              })
            }
          })


        }
      }, 'Refuser',]
    })

    await alert.present();
  }

  async chat() {
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: {user: this.driver}
      
    })

    return await modal.present();
  }

  startCourse() {

    this.driverArrived = false;

    this.directionsRenderer.setMap(null);

    this.directionsRenderer = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: true,
      map: this.map
    });

    this.endMarker.setMap(null);
    this.startMarker.setMap(null);

    this.driverMarker.setMap(null);

    this.driverMarker = new google.maps.Marker({
  
      position: {
        lat: this.originLat,
        lng: this.originLon
      },
      icon: this.iconBase + "car.png",
      map: this.map
    });

    this.startMarker = new google.maps.Marker({
  
      position: {
        lat: this.originLat,
        lng: this.originLon
      },
      icon: this.iconBase + "green-flag.png",
      map: this.map
    });

    this.geocoder.geocode({'address': this.destinationAddress}, (results, status) => {
      this.endMarker = new google.maps.Marker({
  
        position: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        },
        icon: this.iconBase + "red-flag.png",
        map: this.map
      });

      this.directionsRenderer = new google.maps.DirectionsRenderer({
        preserveViewport: true,
        suppressMarkers: true,
        map: this.map
      });
      this.directionsRenderer.setMap(this.map);

      const request = {
        origin: this.startMarker.getPosition(),
        destination: this.endMarker.getPosition(),
        travelMode: 'DRIVING'
      }

      this.directionService.route(request, (result, status) => {
        if (status == 'OK') {
          this.directionsRenderer.setDirections(result);
          let steps = result.routes[0].legs[0].steps;
          let i = 0;
          steps.forEach(step => {
            this.currDistance = step.distance.text;
            this.currDuration = step.duration.text;
            this.currInstruction = step.instructions;
            step.path.forEach((pos, index) => {
              i++;
              var obj = {
                distance: this.currDistance,
                duration: this.currDuration,
                instructions: this.currInstruction,
                latitude: pos.lat(),
                longitude: pos.lng(),
                endRoute: true
              };
              this.stepPoints[i] = obj;
            });
          });
          this.socket.emit("sendRoute", this.stepPoints, this.driver, this.client);
        }
      })

    })
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
        return new Error(err.message || "customized message");
      });
    this.coordinates = fromPromise(POSITION).pipe(
      switchMap((data: any) => of(data.coords))
    );
    return POSITION;
  }

  initMap() {
    this.map = new google.maps.Map(
      document.getElementById("mapdriver"),
      {
        zoom: 12,
        center: { lat: this.driver.latitude_pos, lng: this.driver.longitude_pos },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        disableDefaultUI: true,
      }
    );
    const footer = document.getElementById("footerdriver");
    this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(footer);
  }

}