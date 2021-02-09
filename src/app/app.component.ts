import {Component, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit{
  user: UserInterface;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public authService: AuthService
  ) {
    this.initializeApp();
    this.user = this.authService.getUserDetails();
    console.log(sessionStorage.getItem('connected'))
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
    console.log("Redirection vers les paramètres ?")
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(): void {
    console.log(this.authService.getUserDetails());
  }
}
