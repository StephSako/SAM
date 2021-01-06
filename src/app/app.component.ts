import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
    console.log(sessionStorage.getItem('connected'))
  }

  getSession() {
    return sessionStorage.getItem('connected')
  }

  //FONCTIONS A IMPLEMENTER
  goToClientHome() {
    console.log("Redirection vers l'accueil client")
  }
  goToDriverHome() {
    console.log("Redirection vers l'accueil chauffeur")
  }
  goToAccount() {
    this.router.navigate(['/account'])
  }
  goToHistory() {
    console.log("Redirection vers l'historique des courses")
  }
  goToParams() {
    console.log("Redirection vers les paramètres ?")
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
