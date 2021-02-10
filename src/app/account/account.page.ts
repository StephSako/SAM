import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoInterface, UserInterface } from '../interfaces/userInterface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: UserInterface;

  formGroup = new FormGroup({
    firstNameForm: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    lastNameForm: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    phoneNumberForm: new FormControl('', [Validators.required, this.noWhitespaceValidator, this.phoneNumberValidator])
  });

  constructor(public authService: AuthService, private snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.user = this.authService.getUserDetails();
    console.log(this.user);
    this.formGroup.controls.firstNameForm.setValue(this.user.firstname);
    this.formGroup.controls.lastNameForm.setValue(this.user.lastname);
    this.formGroup.controls.emailForm.setValue(this.user.email);
    this.formGroup.controls.phoneNumberForm.setValue(this.user.phone_number);
  }

  logRatingChange(rating) {
    console.log(rating);
  }

  getErrorMessageFirstname(): string {
    if(this.formGroup.controls.firstNameForm.hasError('required')) {
      return 'Le champ Prénom est requis';
    }
  }

  getErrorMessageLastname(): string {
    if(this.formGroup.controls.lastNameForm.hasError('required')) {
      return 'Le champ Nom est requis';
    }
  }

  getErrorMessageEmail(): string {
    if(this.formGroup.controls.emailForm.hasError('required')) {
      return 'Le champ Email est requis';
    }
  }

  getErrorMessagePassword(): string {
    if(this.formGroup.controls.passwordForm.hasError('required')) {
      return 'Le champ Email est requis';
    }
  }

  getErrorMessagePhone(): string {
    if(this.formGroup.controls.phoneNumberForm.hasError('required')) {
      return 'Le champ téléphone est requis';
    }
  }

  validate() {
    //RECUPERATION DES FORMS
    console.log(this.user);
    this.authService.editUser(this.user)
    .subscribe((data: any) => {
      let snackBarRef = this.snackBar.open(data.message);
    })
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
