import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl, FormControl, NgForm } from '@angular/forms';
import { TokenPayloadRegister } from '../interfaces/userInterface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

   signUp: FormGroup;
   spinnerShown: boolean;

   credentials: TokenPayloadRegister = {
    firstname_user: null,
    lastname_user: null,
    email_user: null,
    role_user_id: 1,
    password_user: null,
    phone_number_user: null
  };

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.signUp = this.formBuilder.group({
      firstname: ['', [Validators.required, this.noWhitespaceValidator]],
      lastname: ['', [Validators.required, this.noWhitespaceValidator]],
      email: ['', [Validators.required, this.noWhitespaceValidator, Validators.email]],
      phone: ['', [this.phoneNumberValidator]],
      password: ['', [Validators.required, this.noWhitespaceValidator]],
      confirmPassword: ['', [this.passwordMatchValidator]]
    })
  }

  ngOnInit() {
  }

  onSignup() {
    this.spinnerShown = true;
    this.authService.register(this.credentials)
    .subscribe((data: any) => {
      this.spinnerShown = false;
    }),
    err => {
      this.spinnerShown = false;
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  passwordMatchValidator(control: AbstractControl) {
    let parent = control.parent;
    if(parent) {
      let password = parent.get("password").value;
      let confirmPassword = control.value;

      if(password != confirmPassword) {
        return { ConfirmPassword: true};
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  phoneNumberValidator(control: FormControl) {
    if(!(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(control.value))) {
      return {'phone_invalid': true}
    } else {
      return null;
    }
  }
}
