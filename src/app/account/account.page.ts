import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  account: Account;
  formGroup = new FormGroup({
    firstNameForm: new FormControl('', [Validators.required]),
    lastNameForm: new FormControl('', [Validators.required]),
    emailForm: new FormControl('', [Validators.required, Validators.email]),
    passwordForm: new FormControl(''),
    passwordAgainForm: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
    //RECUPERATION DES DONNEES
    this.account = {firstName: "Jules", lastName: "Furret", email: "furretj@et.esiea.fr"};
    //REMPLISSAGE DES FORMS
    this.formGroup.controls.firstNameForm.setValue(this.account.firstName);
    this.formGroup.controls.lastNameForm.setValue(this.account.lastName);
    this.formGroup.controls.emailForm.setValue(this.account.email);
  }

  validate() {
    //RECUPERATION DES FORMS
    this.account.firstName = this.formGroup.controls.firstNameForm.value;
    this.account.lastName = this.formGroup.controls.lastNameForm.value;
    this.account.email = this.formGroup.controls.emailForm.value;
    console.log(this.account);
  }

}
