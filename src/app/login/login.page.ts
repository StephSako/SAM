import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenPayloadLogin } from '../interfaces/UserInterface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/UserInterface';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //user: UserInterface;

  login: FormGroup;
  spinnerShown: boolean;
  credentials: TokenPayloadLogin = {
    login_user: null,
    password_user: null,
  };

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar,
    private router: Router) {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, this.noWhitespaceValidator]],
      password: ['', [Validators.required, this.noWhitespaceValidator]],
    })
  }

  onLogin() {
    //var self = this
    this.spinnerShown = true;
    this.authService.login(this.credentials)
    .subscribe((data: any) => {
      if(data.success) {
        //self.user = this.authService.getUserDetails();
        //sessionStorage.setItem('firstname', self.user.firstname)
        //sessionStorage.setItem('lastname', self.user.lastname)
        sessionStorage.setItem('connected', 'true')
        let snackBarRef = this.snackBar.open('Connexion réussie', "Ok", {
          duration: 1500
        });
        this.router.navigate(['/client-home'])
      } else {
        let snackBarRef = this.snackBar.open(data.message, "Ok", {
          duration: 1500
        });
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
