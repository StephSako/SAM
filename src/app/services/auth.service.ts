import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenPayloadLogin, TokenPayloadRegister, TokenResponse, UserInterface } from '../interfaces/UserInterface';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'https://samwebapp.ddns.net:4000/api/user/';
  private token: string;

  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) { }

  public register(user: TokenPayloadRegister): Observable<any> {
    const URL = this.http.post(this.baseURL + 'register', user);
    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  public uploadProfilePic(formData, userId: number, profilePicName: string): Observable<any> {
    return this.http.post(this.baseURL + 'profile_pic/upload/' + userId + '/' + profilePicName, formData);
  }

  public downloadProfilePic(userId: number): Observable<SafeResourceUrl> {
    return this.http
        .get(this.baseURL + 'profile_pic/download/' + userId, { responseType: 'blob' })
        .pipe(
            map(x => {
              const urlToBlob = window.URL.createObjectURL(x); // get a URL for the blob
              return this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob); // tell Anuglar to trust this value
            }),
        );
  }

  public login(user: TokenPayloadLogin): Observable<any> {
    const URL = this.http.post(this.baseURL + 'login', user);

    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  private saveToken(token: string): void {
    window.localStorage.setItem('userToken', token);
    this.token = token;
  }

  public logout(): void {
    this.token = '';
    sessionStorage.setItem('connected', 'false');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserInterface {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  private getToken(): string {
    if (!this.token) { this.token = localStorage.getItem('userToken'); }
    return this.token;
  }

  public editUser(user: UserInterface) {
    const URL = this.http.put(this.baseURL + 'edit/' + user.id_user, user);

    return URL.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  public getDrivers() {
    return this.http.get(this.baseURL + 'drivers');
  }
}
