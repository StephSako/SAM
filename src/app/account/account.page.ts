import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from '../interfaces/userInterface';
import { AuthService } from '../services/auth.service';
import {SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: UserInterface;
  urlProfilePic: SafeResourceUrl;
  profilePic: File = null;

  formGroup = new FormGroup({
    firstNameForm: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    lastNameForm: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    phoneNumberForm: new FormControl('', [Validators.required, this.noWhitespaceValidator, this.phoneNumberValidator])
  });

  constructor(public authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = this.authService.getUserDetails();
    this.authService.downloadProfilePic(this.user.id_user).subscribe(urlProfilePic => this.urlProfilePic = urlProfilePic
        , err => console.log('ERREUR', err));
    this.formGroup.controls.firstNameForm.setValue(this.user.firstname);
    this.formGroup.controls.lastNameForm.setValue(this.user.lastname);
    this.formGroup.controls.emailForm.setValue(this.user.email);
    this.formGroup.controls.phoneNumberForm.setValue(this.user.phone_number);
  }

  logRatingChange(rating) {
    console.log(rating);
  }

  getErrorMessageFirstname(): string {
    if (this.formGroup.controls.firstNameForm.hasError('required')) {
      return 'Le champ Prénom est requis';
    }
  }

  getErrorMessageLastname(): string {
    if (this.formGroup.controls.lastNameForm.hasError('required')) {
      return 'Le champ Nom est requis';
    }
  }

  getErrorMessageEmail(): string {
    if (this.formGroup.controls.emailForm.hasError('required')) {
      return 'Le champ Email est requis';
    }
  }

  getErrorMessagePassword(): string {
    if (this.formGroup.controls.passwordForm.hasError('required')) {
      return 'Le champ Email est requis';
    }
  }

  getErrorMessagePhone(): string {
    if (this.formGroup.controls.phoneNumberForm.hasError('required')) {
      return 'Le champ téléphone est requis';
    }
  }

  validate() {
    // RECUPERATION DES FORMS
    this.authService.editUser(this.user).subscribe((data: any) => {
      const uploadData = new FormData();
      uploadData.append('profilePic', this.profilePic, (this.profilePic ? this.profilePic.name : ''));
      this.authService.uploadProfilePic(uploadData, this.authService.getUserDetails().id_user, this.profilePic.name).subscribe(() => {
        this.snackBar.open('Compte modifié avec succès', 'OK', { duration: 2000, panelClass: null });
      });
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  passwordMatchValidator(control: AbstractControl) {
    const parent = control.parent;
    if (parent) {
      const password = parent.get("password").value;
      const confirmPassword = control.value;

      if (password != confirmPassword) {
        return { ConfirmPassword: true};
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  phoneNumberValidator(control: FormControl) {
    if (!(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(control.value))) {
      return {'phone_invalid': true};
    } else {
      return null;
    }
  }

  onFileChanged(event) {
    this.profilePic = event.target.files[0];
    this.user.profile_pic_name = this.profilePic.name;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => this.urlProfilePic = reader.result;
    const formData = new FormData();
    formData.append('upload', event.target.files[0], event.target.files[0].name);
  }

}
