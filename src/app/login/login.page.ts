import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenPayloadLogin } from '../Interfaces/UserInterface';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login: FormGroup;
  spinnerShown: boolean;
  credentials: TokenPayloadLogin = {
    login_user: null,
    password_user: null,
  };

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, this.noWhitespaceValidator]],
      password: ['', [Validators.required, this.noWhitespaceValidator]],
    })
  }
  //FONCTIONS A IMPLEMENTER
  goToClientHome() {
    console.log("Redirection vers l'accueil client")
  }
  goToDriverHome() {
    console.log("Redirection vers l'accueil chauffeur")
  }
  goToAccount() {
    console.log("Redirection vers le compte")
  }
  goToHistory() {
    console.log("Redirection vers l'historique des courses")
  }
  goToParams() {
    console.log("Redirection vers les paramètres ?")
  }

  onLogin() {
    this.spinnerShown = true;
    console.log(this.login.value);
    this.authService.login(this.credentials)
    .subscribe((data: any) => {
      console.log(data);
      if(data.success) {
        let snackBarRef = this.snackBar.open('Connexion réussi');
      } else {
        let snackBarRef = this.snackBar.open(data.message);
      }
    })
  }

  getErrorMessageLogin(): string {
    if(this.login.controls.email.hasError('required')) {
      return 'Le champ mail est requis';
    }
  }

  getErrorMessagePassword(): string {
    if(this.login.controls.password.hasError('required')) {
      return 'Le champ mot de passe est requis';
    }
  }

  ngOnInit() {
    
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
