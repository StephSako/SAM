import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserInterface } from './interfaces/userInterface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user: UserInterface;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService
  ) {
    this.initializeApp();
    this.user = this.authService.getUserDetails();
  }

  getSession() {
    return sessionStorage.getItem('connected')
  }

  //FONCTIONS A IMPLEMENTER
  goToClientHome() {
    this.router.navigate(['/client-home'])
  }
  goToDriverHome() {
    this.router.navigate(['/mapdriver'])
  }
  goToAccount() {
    this.router.navigate(['/account'])
  }
  goToHistory() {
    this.router.navigate(['/history'])
  }
  goToParams() {
  }
  signOff() {
    sessionStorage.setItem("connected","false")
    this.router.navigate(['/'])
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
