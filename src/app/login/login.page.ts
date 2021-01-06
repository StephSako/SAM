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

  onLogin() {
    this.spinnerShown = true;
    console.log(this.login.value);
    this.authService.login(this.credentials)
    .subscribe((data: any) => {
      console.log(data);
      if(data.success) {
        sessionStorage.setItem('connected', 'true')
        let snackBarRef = this.snackBar.open('Connexion réussie');
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
