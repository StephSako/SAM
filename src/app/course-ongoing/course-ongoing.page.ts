import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap, first } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverData } from '../tab1/driver-data.model';
import { Socket } from 'ngx-socket-io';
import { UserInterface } from '../interfaces/UserInterface';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatPage } from '../chat/chat.page';

const { Toast, Geolocation } = Capacitor.Plugins;

@Component({
  selector: 'app-course-ongoing',
  templateUrl: './course-ongoing.page.html',
  styleUrls: ['./course-ongoing.page.scss'],
})



export class CourseOngoingPage implements OnInit {

  private geocoder;
  public driverArrived;
  public distance;
  public time;
  public arrived: boolean;
  lon;
  lat;
  currLon;
  currLat;
  private directionService;
  public map: google.maps.Map;
  private markers = new Array();
  public driver: DriverData;
  address: string;
  clientAddress: string;
  private client: UserInterface;
  private iconBase: string;
  public searching: boolean;
  private driverMarker: google.maps.Marker;
  private originLat;
  private originLon;
  private start;
  private end;
  public courseStarted;
  public destLat;
  public destLng;
  public messages = [];


  public coordinates: Observable<GeolocationPosition>;
  public defaultPos: {
    lattitude: 45,
    longitude: 9
  };

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef

  constructor(public loading: LoadingController,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private socket: Socket,
    private authService: AuthService,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private storage: Storage,
    public modalCtrl: ModalController) {
    this.geocoder = new google.maps.Geocoder();
    this.courseStarted = false;
    this.arrived = false;
    this.searching = true;
    this.iconBase = "http://92.170.102.230/"
    this.client = this.authService.getUserDetails();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.lon = this.router.getCurrentNavigation().extras.state.lon;
        this.lat = this.router.getCurrentNavigation().extras.state.lat;
        this.driver = this.router.getCurrentNavigation().extras.state.driver;
        this.address = this.router.getCurrentNavigation().extras.state.address;
        this.clientAddress = this.router.getCurrentNavigation().extras.state.clientAddress;
        this.originLat = this.router.getCurrentNavigation().extras.state.originLat;
        this.originLon = this.router.getCurrentNavigation().extras.state.originLon;
        let objSaved = {};
        objSaved["lon"] = this.lon;
        objSaved["lat"] = this.lat;
        objSaved["driver"] = this.driver;
        objSaved["address"] = this.address;
        objSaved["clientAddress"] = this.clientAddress;
        objSaved["originLat"] = this.originLat;
        objSaved["originLon"] = this.originLon;
        storage.set("obj", objSaved);
        let courseInfo = {
          driver: this.driver,
          address: this.address,
          clientAddress: this.clientAddress,
          client: this.client,
          lat: this.lat,
          lon: this.lon,
          originLat: this.originLat,
          originLon: this.originLon
        }
        console.log("COURSE INFO");
        console.log(courseInfo)
        this.socket.emit("newCourse", courseInfo);
      } else {
        let objj = this.getDataFromStorage();
        objj.then((obj) => {
          this.lon = obj["lon"];
          this.lat = obj["lat"];
          this.driver = obj["driver"];
          this.address = obj["address"];
          this.clientAddress = obj["clientAddress"];
          this.originLat = obj["originLat"];
          this.originLon = obj["originLon"];
          let courseInfo = {
            driver: this.driver,
            address: this.address,
            clientAddress: this.clientAddress,
            client: this.client,
            lat: this.lat,
            lon: this.lon,
            originLat: this.originLat,
            originLon: this.originLon
          }
          console.log("COURSE INFO");
          console.log(courseInfo)
          this.socket.emit("newCourse", courseInfo);
        })
      }

    })
    this.directionService = new google.maps.DirectionsService();

    socket.fromEvent('courseFinished').subscribe((data:any) => {
      console.log("Course Finished")
    })

    socket.fromEvent('driverArrived').subscribe((data: any) => {
      console.log("ARRIVED");
      this.arrived = true;
      this.driverMarker.setMap(null);

      this.driverMarker = new google.maps.Marker({

        position: {
          lat: this.originLat,
          lng: this.originLon
        },
        icon: this.iconBase + "car.png",
        map: this.map
      });

      this.geocoder.geocode({'address': this.address}, (results, status) => {
        this.destLat = results[0].geometry.location.lat();
        this.destLng = results[0].geometry.location.lng();
      })

    })

    socket.fromEvent('step').subscribe((step: any) => {
      this.searching = false;
      if(step.endRoute) {
        this.courseStarted = true;
      }
      let newLatLng = new google.maps.LatLng(step.latitude, step.longitude);
      this.driverMarker.setPosition(newLatLng);
      this.start = new google.maps.Marker({
        position: {
          lat: step.latitude,
          lng: step.longitude
        },
      });

      if(step.endRoute) {
        this.end = new google.maps.Marker({
          position: {
            lat: this.destLat,
            lng: this.destLng
          },
        });
      } else {
        this.end = new google.maps.Marker({
          position: {
            lat: this.originLat,
            lng: this.originLon
          },
        });
      }




      new google.maps.DistanceMatrixService().getDistanceMatrix({
        origins: [this.start.getPosition()],
        destinations: [this.end.getPosition()],
        travelMode: google.maps.TravelMode.BICYCLING,
        avoidHighways: true,
        avoidTolls: true
      }, (response, status) => {
        if (status == 'OK') {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;

          for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
              var element = results[j];
              this.distance = element.distance.text;
              this.time = element.duration.text;
              var from = origins[i];
              var to = destinations[j];
            }
          }
        }
        this.cd.detectChanges();
      });

    })
  }

  async getDataFromStorage() {
    return await this.storage.get('obj');
  }

  async chat() {
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: {user: this.client}
      
    })

    return await modal.present();
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

    this.driverMarker = new google.maps.Marker({
      position: {
        lat: this.driver.latitude_pos,
        lng: this.driver.longitude_pos
      },
      icon: this.iconBase + "bicycle.png",
      map: this.map
    })
  }

  trajet() {
    //this.clearMarkers();
    let start = new google.maps.Marker({

      position: {
        lat: this.lat,
        lng: this.lon
      },
      icon: this.iconBase + "red-flag.png",
      map: this.map
    });

    let end = new google.maps.Marker({
      position: {
        lat: this.originLat,
        lng: this.originLon,
      },
      icon: this.iconBase + "green-flag.png",
      map: this.map
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
      suppressMarkers: true,
      map: this.map
    });
    directionsRenderer.setMap(this.map);

    this.directionService.route(request, (result, status) => {

      if (status == 'OK') {

        directionsRenderer.setDirections(result);
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
          console.log(element);
          var distance = element.distance.text;
          console.log(distance);
          var duration = element.duration.text;
          console.log(duration);
          var from = origins[i];
          var to = destinations[j];
        }
      }
    }
    //this.cd.detectChanges();
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